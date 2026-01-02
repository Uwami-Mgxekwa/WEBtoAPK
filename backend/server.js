const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ensure required directories exist
const ensureDirectories = async () => {
    const dirs = [
        path.join(__dirname, 'uploads'),
        path.join(__dirname, 'builds'),
        path.join(__dirname, 'temp')
    ];

    for (const dir of dirs) {
        await fs.ensureDir(dir);
    }

    console.log('✅ Required directories created');
};

// API Routes
app.use('/api', apiRoutes);

// Serve built APK files
app.use('/downloads', express.static(path.join(__dirname, 'builds')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'WEBtoAPK API',
        version: '1.0.0',
        description: 'Convert web applications to Android APK files',
        endpoints: {
            build: 'POST /api/build',
            status: 'GET /api/status/:jobId',
            download: 'GET /downloads/:filename',
            health: 'GET /health'
        },
        poweredBy: 'brelinx.com'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const startServer = async () => {
    try {
        await ensureDirectories();

        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 WEBtoAPK Backend Server');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`💚 Health: http://localhost:${PORT}/health`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Powered by brelinx.com 🚀');
            console.log('');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
