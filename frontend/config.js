// API Configuration
const API_CONFIG = {
    // Development: local backend
    development: 'http://localhost:3000/api',
    
    // Production: Render.com backend
    production: 'https://webtoap.onrender.com/api'
};

// Detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Export API base URL
const API_BASE_URL = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

console.log(`🚀 Running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
console.log(`📡 API endpoint: ${API_BASE_URL}`);
