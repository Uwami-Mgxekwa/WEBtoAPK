const fs = require('fs-extra');
const path = require('path');

class FileHandler {
    /**
     * Prepare files for building
     * - Validates files
     * - Creates directory structure
     * - Organizes files for Cordova
     */
    async prepareFiles(job) {
        try {
            // Ensure build directory exists
            await fs.ensureDir(job.buildDir);

            // Create www directory (Cordova web root)
            const wwwDir = path.join(job.buildDir, 'www');
            await fs.ensureDir(wwwDir);

            // Move/Copy uploaded files to www
            // If the user uploaded a single index.html or flat files
            // we copy them directly. If they uploaded a folder structure, we need to handle that.
            // For now, we assume flat files or flat list of files from multer.

            for (const filePath of job.files) {
                const fileName = path.basename(filePath);
                await fs.copy(filePath, path.join(wwwDir, fileName));
            }

            // If an icon was provided, prepare it
            if (job.icon) {
                const iconDir = path.join(job.buildDir, 'res', 'icon', 'android');
                await fs.ensureDir(iconDir);
                await fs.copy(job.icon, path.join(job.buildDir, 'icon.png'));
            }

            // Create a default config.xml template if we were doing manual Cordova setup
            // But apkBuilder will handle the CLI commands which create the project.
            // So here we mostly just need to ensure the source files are ready.

            console.log(`Prepared files for job ${job.id}`);

        } catch (error) {
            console.error('File preparation failed:', error);
            throw new Error('Failed to process uploaded files: ' + error.message);
        }
    }
}

module.exports = new FileHandler();
