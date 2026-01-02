const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const apkBuilder = require('../services/apkBuilder');
const fileHandler = require('../services/fileHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads', req.uploadId);
        fs.ensureDirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
        files: 100 // Max 100 files
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [
            '.html', '.css', '.js', '.json',
            '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico',
            '.woff', '.woff2', '.ttf', '.otf', '.eot'
        ];

        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${ext} not allowed`));
        }
    }
});

// Middleware to generate upload ID
router.use((req, res, next) => {
    req.uploadId = uuidv4();
    next();
});

// Job storage (in production, use Redis or a database)
const jobs = new Map();

/**
 * POST /api/build
 * Upload files and start APK build
 */
router.post('/build', upload.fields([
    { name: 'files', maxCount: 100 },
    { name: 'icon', maxCount: 1 }
]), async (req, res) => {
    const jobId = req.uploadId;

    try {
        // Validate files
        if (!req.files || !req.files.files || req.files.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Parse config
        const config = JSON.parse(req.body.config || '{}');
        console.log(`[Job ${jobId}] Received build request for App: "${config.appName}" (${config.packageName})`);
        console.log(`[Job ${jobId}] Uploaded ${req.files.files.length} file(s)`);

        // Validate config
        if (!config.appName || !config.packageName) {
            console.warn(`[Job ${jobId}] Missing appName or packageName`);
            return res.status(400).json({ error: 'App name and package name are required' });
        }

        // Validate package name format
        const packageRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
        if (!packageRegex.test(config.packageName)) {
            console.warn(`[Job ${jobId}] Invalid package name: ${config.packageName}`);
            return res.status(400).json({
                error: 'Invalid package name format. Use reverse domain notation (e.g., com.example.app)'
            });
        }

        // Check for index.html
        const hasIndexHtml = req.files.files.some(f =>
            f.originalname.toLowerCase() === 'index.html'
        );

        if (!hasIndexHtml) {
            console.warn(`[Job ${jobId}] index.html missing`);
            return res.status(400).json({ error: 'index.html is required' });
        }

        // Create job
        const job = {
            id: jobId,
            status: 'queued',
            progress: 0,
            config: config,
            files: req.files.files.map(f => f.path),
            icon: req.files.icon ? req.files.icon[0].path : null,
            uploadDir: path.join(__dirname, '../uploads', jobId),
            buildDir: path.join(__dirname, '../builds', jobId),
            createdAt: new Date().toISOString()
        };

        jobs.set(jobId, job);
        console.log(`[Job ${jobId}] Job queued. Starting build process...`);

        // Start build process asynchronously
        buildAPK(job).catch(error => {
            console.error(`[Job ${jobId}] Build FAILED:`, error);
            job.status = 'failed';
            job.error = error.message;
        });

        res.json({
            jobId: jobId,
            status: 'queued',
            message: 'Build started successfully'
        });

    } catch (error) {
        console.error('Build endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/status/:jobId
 * Get build status
 */
router.get('/status/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = jobs.get(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        apkUrl: job.apkUrl,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt
    });
});

/**
 * DELETE /api/cleanup/:jobId
 * Clean up job files
 */
router.delete('/cleanup/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const job = jobs.get(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    try {
        // Remove upload and build directories
        await fs.remove(job.uploadDir);
        await fs.remove(job.buildDir);

        // Remove job from memory
        jobs.delete(jobId);

        res.json({ message: 'Job cleaned up successfully' });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Build APK asynchronously
 */
async function buildAPK(job) {
    try {
        // Update status
        job.status = 'processing';
        job.progress = 10;
        console.log(`[Job ${job.id}] Status: processing (10%)`);

        // Prepare files
        await fileHandler.prepareFiles(job);
        job.progress = 30;
        console.log(`[Job ${job.id}] Status: files prepared (30%)`);

        // Build APK
        job.status = 'building';
        console.log(`[Job ${job.id}] Status: building APK...`);
        const apkPath = await apkBuilder.buildAPK(job);
        job.progress = 80;
        console.log(`[Job ${job.id}] Status: APK built! (80%)`);

        // Sign APK (if needed)
        job.status = 'signing';
        job.progress = 90;
        console.log(`[Job ${job.id}] Status: signing... (90%)`);

        // Complete
        job.status = 'completed';
        job.progress = 100;
        job.apkUrl = `/downloads/${job.id}/${path.basename(apkPath)}`;
        job.completedAt = new Date().toISOString();

        console.log(`✅ [Job ${job.id}] SUCCESS! APK ready at: ${job.apkUrl}`);

        // Schedule cleanup after 1 hour
        setTimeout(async () => {
            try {
                await fs.remove(job.uploadDir);
                console.log(`🧹 [Job ${job.id}] Cleaned up upload directory`);
            } catch (error) {
                console.error(`[Job ${job.id}] Cleanup error:`, error);
            }
        }, 60 * 60 * 1000);

    } catch (error) {
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date().toISOString();
        throw error;
    }
}

module.exports = router;
