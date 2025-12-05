// API Configuration for Recipe App
// Update this file to change API endpoints for different environments

const API_CONFIG = {
    // Development with Live Server + PHP server
    development: {
        baseUrl: 'http://localhost:8000',
        description: 'Live Server (frontend) + PHP server (backend)'
    },
    
    // Production with everything on same server
    production: {
        baseUrl: '',
        description: 'Everything on same server'
    },
    
    // XAMPP setup
    xampp: {
        baseUrl: 'http://localhost/projet1-recepies',
        description: 'XAMPP Apache server'
    }
};

// Current environment - change this to switch between setups
const CURRENT_ENV = 'development';

// Export the current API base URL
window.API_BASE_URL = API_CONFIG[CURRENT_ENV].baseUrl;

// Log current configuration
console.log(`🍳 Recipe App API Config: ${API_CONFIG[CURRENT_ENV].description}`);
console.log(`🔗 API Base URL: ${window.API_BASE_URL || 'Same origin'}`);
