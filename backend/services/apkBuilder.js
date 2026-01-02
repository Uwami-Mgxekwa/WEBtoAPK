const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

class ApkBuilder {
    constructor() {
        this.brandingTemplate = null;
    }

    async loadBranding() {
        if (!this.brandingTemplate) {
            const templatePath = path.join(__dirname, '../templates/branding.html');
            this.brandingTemplate = await fs.readFile(templatePath, 'utf8');
        }
        return this.brandingTemplate;
    }

    async buildAPK(job) {
        console.log(`Starting APK build for job ${job.id}`);
        const buildDir = job.buildDir;
        const wwwDir = path.join(buildDir, 'www');

        try {
            // 1. Inject branding into index.html
            await this.injectBranding(wwwDir);

            // 2. Create Cordova project
            // In a real scenario, we might use 'cordova create' but that creates a new folder.
            // Since we already organized files in buildDir, we'll run create in a temp spot 
            // and move files, or better:
            // Let's create a NEW cordova project folder inside buildDir

            const projectDir = path.join(buildDir, 'cordova_project');
            const { appName, packageName } = job.config;

            // Clean/sanitized app name
            const cleanAppName = appName.replace(/[^a-zA-Z0-9 ]/g, "");

            console.log('Creating Cordova project...');
            await execPromise(`cordova create "${projectDir}" "${packageName}" "${cleanAppName}"`);

            // 3. Configure platform
            console.log('Adding Android platform...');
            await execPromise(`cd "${projectDir}" && cordova platform add android`);

            // 4. Copy web assets to cordova www
            console.log('Copying web assets...');
            // Cordova's default www has css/js/img folders. We overwrite it.
            const cordovaWww = path.join(projectDir, 'www');
            await fs.emptyDir(cordovaWww);
            await fs.copy(wwwDir, cordovaWww);

            // 5. Handle Icon
            if (job.icon) {
                // Copy icon to resources (simplified - usually requires multiple sizes)
                // Keeping it simple for MVP: copy to default icon location in config.xml could be complex
                // For now, simpler to skip complex resource generation without 'cordova-res'
                console.log('Icon processing pending implementation (requires cordova-res)');
            }

            // 6. Build APK
            console.log('Building APK...');
            // --release usually requires signing config. using --debug for now as planned
            await execPromise(`cd "${projectDir}" && cordova build android --debug`);

            // 7. Locate APK
            // Path depends on cordova version, usually:
            // platforms/android/app/build/outputs/apk/debug/app-debug.apk
            const apkSource = path.join(projectDir, 'platforms/android/app/build/outputs/apk/debug/app-debug.apk');

            if (!await fs.pathExists(apkSource)) {
                // Fallback for older cordova versions
                const legacyPath = path.join(projectDir, 'platforms/android/build/outputs/apk/debug/app-debug.apk');
                if (await fs.pathExists(legacyPath)) {
                    // move on
                } else {
                    throw new Error('Could not locate generated APK file');
                }
            }

            return apkSource;

        } catch (error) {
            console.error('Build failed details:', error);
            // Check if cordova is installed
            if (error.stderr && error.stderr.includes('cordova: command not found')) {
                throw new Error('Cordova is not installed on the server');
            }
            throw new Error(`Build failed: ${error.message}`);
        }
    }

    async injectBranding(wwwDir) {
        try {
            const indexHtmlPath = path.join(wwwDir, 'index.html');
            if (await fs.pathExists(indexHtmlPath)) {
                let content = await fs.readFile(indexHtmlPath, 'utf8');
                const branding = await this.loadBranding();

                // Inject before </body>
                if (content.includes('</body>')) {
                    content = content.replace('</body>', `${branding}\n</body>`);
                } else {
                    // No body tag? Append to end
                    content += branding;
                }

                await fs.writeFile(indexHtmlPath, content);
                console.log('Branding injected successfully');
            }
        } catch (error) {
            console.warn('Failed to inject branding:', error);
            // Don't fail the build just for branding
        }
    }
}

module.exports = new ApkBuilder();
