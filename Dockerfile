FROM node:18-bullseye

# Set environment variables
ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV ANDROID_HOME /opt/android-sdk
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64
ENV PATH ${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/build-tools/33.0.2

# Prevent interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies (Java JDK, wget, unzip, git, gradle)
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    wget \
    unzip \
    git \
    gradle \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK Command Line Tools
# Version: Command line tools 9.0 (latest as of check)
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/tools.zip \
    && unzip -q /tmp/tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
    && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm /tmp/tools.zip

# Accept Android SDK Licenses
RUN yes | sdkmanager --licenses

# Install minimal Android Build Tools and Platform to save space
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# Install Cordova globally
RUN npm install -g cordova

# Set working directory
WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Create necessary directories
RUN mkdir -p uploads builds temp

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
