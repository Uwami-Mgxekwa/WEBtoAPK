# Deployment Guide

## 1. Deploy Frontend (GitHub Pages)

The frontend is a static site that can be hosted anywhere.

1.  Push your code to GitHub.
2.  Go to **Settings > Pages**.
3.  Select **Source**: `Deploy from a branch`.
4.  Select `main` (or `gh-pages`) branch and `/frontend` folder (if possible) or push the `/frontend` contents to a separate branch.
    -   *Tip*: You can convert the root to hold the frontend and move backend to a subfolder, OR use `git subtree push --prefix frontend origin gh-pages`.

## 2. Deploy Backend (Render.com)

The backend requires a server to run Node.js and the Android SDK.

> **Note**: The Free Tier of Render.com might not support installing the full Android SDK easily. You might need a Dockerfile-based deployment to include the Android SDK.

### Docker Deployment (Recommended)

Create a `Dockerfile` in `/backend`:

```dockerfile
FROM node:18-bullseye

# Install Java
RUN apt-get update && apt-get install -y openjdk-11-jdk

# Install Android SDK
ENV ANDROID_SDK_ROOT /opt/android-sdk
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools
# Download & Unzip Android Command Line Tools...

# Install Cordova
RUN npm install -g cordova

# App Setup
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
```

## 3. Environment Variables

Set these in your cloud provider:

-   `NODE_ENV`: `production`
-   `CORS_ORIGIN`: `https://your-frontend.github.io`
