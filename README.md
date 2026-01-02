# WEBtoAPK - Convert Web Apps to Android APK

Transform your HTML, CSS, and JavaScript web applications into installable Android APK files with ease.

## 🚀 Features

- **Simple Upload**: Drag and drop your web files
- **Instant Conversion**: Automated APK generation using Apache Cordova
- **Customizable**: Set app name, package name, version, and icon
- **Free Hosting**: Frontend on GitHub Pages, backend on Render.com
- **Professional Output**: Signed, installable APK files

## 🏗️ Architecture

- **Frontend**: Static HTML/CSS/JS hosted on GitHub Pages
- **Backend**: Node.js + Express API on Render.com
- **APK Builder**: Apache Cordova with Android SDK

## 📋 Prerequisites

### For Backend Deployment (Render.com)
- Java JDK 11 or higher
- Android SDK (API Level 30+)
- Node.js 18+
- Gradle

### For Local Development
- Node.js 18+
- npm or yarn

## 🛠️ Installation

### Frontend Setup
```bash
# No build required - static files
# Just open frontend/index.html in browser for local testing
```

### Backend Setup
```bash
cd backend
npm install

# Set environment variables
export ANDROID_SDK_ROOT=/path/to/android-sdk
export JAVA_HOME=/path/to/java

# Run locally
npm run dev
```

## 🌐 Deployment

### Deploy Frontend to GitHub Pages
```bash
# Push to gh-pages branch
git subtree push --prefix frontend origin gh-pages

# Or use GitHub Actions (see .github/workflows/deploy.yml)
```

### Deploy Backend to Render.com
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables (see docs/deployment.md)

## 📖 Usage

1. Visit your deployed frontend (GitHub Pages URL)
2. Upload your HTML, CSS, and JavaScript files
3. Configure app settings (name, package, icon)
4. Click "Generate APK"
5. Download your Android app!

## 🎨 Branding

All generated APKs include "Powered by brelinx.com" branding in the app footer.

## 📁 Project Structure

```
WEBtoAPK/
├── frontend/           # Static frontend (GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── config.js
├── backend/            # Node.js API (Render.com)
│   ├── server.js
│   ├── routes/
│   ├── services/
│   ├── templates/
│   └── package.json
├── docs/              # Documentation
│   ├── setup.md
│   └── deployment.md
└── README.md
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Test APK generation
npm run test:build
```

## 📝 License

MIT License - feel free to use and modify!

## 🔗 Links

- **Website**: [brelinx.com](https://brelinx.com)
- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

**Powered by brelinx.com** 🚀
