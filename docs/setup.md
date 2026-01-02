# Setup Guide

## System Requirements

To run this project locally, you need:

1.  **Node.js** (v18 or higher)
2.  **Java JDK** (v11 or higher)
3.  **Android SDK** (Command line tools)
4.  **Gradle**

## Step 1: Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/WEBtoAPK.git
cd WEBtoAPK

# Install backend dependencies
cd backend
npm install
```

## Step 2: Install Android SDK & Cordova

1.  Download Android Command Line Tools
2.  Install Cordova globally:
    ```bash
    npm install -g cordova
    ```
3.  Set Environment Variables:
    -   `ANDROID_SDK_ROOT`: Path to your Android SDK folder
    -   `JAVA_HOME`: Path to your JDK folder
    -   Add platform-tools to PATH

## Step 3: Run Locally

```bash
# Start Backend
cd backend
npm run dev

# Open Frontend
# Navigate to /frontend/index.html in your browser
```

## Troubleshooting

-   **Cordova not found**: Ensure `npm install -g cordova` ran successfully and npm global bin is in your PATH.
-   **Android SDK missing**: Run `flutter doctor` or `cordova requirements` to verify your Android setup.
