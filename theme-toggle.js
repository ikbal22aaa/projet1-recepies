// Theme Toggle System
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Create toggle button if it doesn't exist
        if (!document.querySelector('.theme-toggle')) {
            this.createToggleButton();
        }
        
        // Update button state
        this.updateToggleButton();
    }

    createToggleButton() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        
        toggleBtn.addEventListener('click', () => this.toggle());
        
        // Insert before auth buttons
        authButtons.parentNode.insertBefore(toggleBtn, authButtons);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateToggleButton();
        
        // Add animation class
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    updateToggleButton() {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        const icon = btn.querySelector('i');
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Initialize theme toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
});
