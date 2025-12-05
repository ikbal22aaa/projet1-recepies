// Dark Mode Handler for Recipe Website
(function() {
    'use strict';
    
    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
        
        applyTheme(theme);
        updateThemeToggle(theme);
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#2d3436' : '#ffffff');
        }
        
        // Trigger theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    // Update theme toggle UI
    function updateThemeToggle(theme) {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        const icon = toggle.querySelector('i');
        const label = toggle.querySelector('span');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            if (label) label.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            if (label) label.textContent = 'Dark Mode';
        }
    }
    
    // Create theme toggle button
    function createThemeToggle() {
        const navInner = document.querySelector('.nav-inner');
        if (!navInner) return;
        
        const toggle = document.createElement('button');
        toggle.id = 'themeToggle';
        toggle.className = 'theme-toggle nav-link';
        toggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
        
        toggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            updateThemeToggle(newTheme);
        });
        
        // Insert at the end, before any existing action buttons
        navInner.insertBefore(toggle, navInner.lastElementChild);
    }
    
    // CSS injections for dark mode
    function injectDarkModeCSS() {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            :root[data-theme="dark"] {
                --primary-color: #ff7675;
                --secondary-color: #74b9ff;
                --accent-color: #fd79a8;
                --warning-color: #fdcb6e;
                --success-color: #a29bfe;
                --background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
                --card-bg: rgba(45, 52, 54, 0.95);
                --text-dark: #ddd;
                --text-light: #aaa;
                --shadow: 0 20px 40px rgba(0,0,0,0.3);
                --shadow-hover: 0 30px 60px rgba(0,0,0,0.4);
            }
            
            .dark-mode {
                color-scheme: dark;
            }
            
            .dark-mode header::before {
                background: linear-gradient(45deg, #2d3436, #636e72, #74b9ff);
            }
            
            .dark-mode .nav-link::before,
            .dark-mode .btn::before,
            .dark-mode .cta::before {
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            }
            
            .dark-mode .theme-toggle {
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                color: white;
            }
            
            .dark-mode .theme-toggle:hover {
                background: linear-gradient(45deg, var(--secondary-color), var(--accent-color));
            }
            
            .dark-mode .search-input,
            .dark-mode .input-field,
            .dark-mode .add-item-input,
            .dark-mode .ingredient-input-row input,
            .dark-mode .instruction-input-row input {
                background: rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
                color: var(--text-dark);
            }
            
            .dark-mode select {
                background: rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
                color: var(--text-dark);
            }
            
            .dark-mode .message.bot {
                background: rgba(0,0,0,0.3);
                border-color: rgba(255,255,255,0.2);
            }
            
            .dark-mode .chart-container {
                background: rgba(0,0,0,0.3);
            }
            
            .dark-mode .rating-stars .star {
                color: #ffa500;
            }
            
            .dark-mode .rating-stars .star:hover {
                color: #ff8c00;
            }
            
            /* Smooth transitions */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            
            /* Scrollbar styles for dark mode */
            .dark-mode ::-webkit-scrollbar {
                width: 12px;
            }
            
            .dark-mode ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .dark-mode ::-webkit-scrollbar-thumb {
                background: var(--primary-color);
                border-radius: 6px;
            }
            
            .dark-mode ::-webkit-scrollbar-thumb:hover {
                background: var(--secondary-color);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Listen for system theme changes
    function setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(function(e) {
            if (localStorage.getItem('theme') === 'auto') {
                applyTheme(e.matches ? 'dark' : 'light');
                updateThemeToggle(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Initialize everything when DOM is ready
    function init() {
        injectDarkModeCSS();
        initTheme();
        createThemeToggle();
        setupSystemThemeListener();
        
        // Animation enhancement for theme toggle
        setTimeout(() => {
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                toggle.classList.add('animate-fadeInRight');
            }
        }, 500);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { initTheme, applyTheme, updateThemeToggle };
    }
})();
