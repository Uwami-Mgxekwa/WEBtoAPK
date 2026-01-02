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
# Just open index.html in the root directory in your browser for local testing
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
# Push root directory to gh-pages or main branch
# Configure GitHub Pages to serve from root
```

### Deploy Backend to Render.com
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Root Directory to `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (see docs/deployment.md)

## 📖 Usage

1. Visit your deployed frontend
2. Upload your HTML, CSS, and JavaScript files
3. Configure app settings (name, package, icon)
4. Click "Generate APK"
5. Download your Android app!

## 🎨 Branding

All generated APKs include "Powered by brelinx.com" branding in the app footer.

## 📁 Project Structure

```
WEBtoAPK/
├── index.html          # Frontend Entry
├── style.css           # Frontend Styles
├── app.js              # Frontend Logic
├── config.js           # API Config
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
