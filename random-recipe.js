// Random Recipe Generator
class RandomRecipe {
    constructor() {
        this.init();
    }

    init() {
        this.addStyles();
    }

    createSurpriseMeButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-primary surprise-me-btn';
        button.innerHTML = '<i class="fas fa-dice"></i> Surprise Me!';
        button.style.cssText = 'animation: pulse 2s infinite;';

        button.addEventListener('click', () => this.getRandomRecipe());

        return button;
    }

    async getRandomRecipe() {
        try {
            const recipes = await window.MockAPI.getRecipes({});

            if (recipes.length === 0) {
                alert('No recipes available!');
                return;
            }

            // Show loading animation
            this.showLoadingAnimation();

            // Random selection with delay for effect
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * recipes.length);
                const randomRecipe = recipes[randomIndex];

                // Navigate to recipe page
                window.location.href = `recipe.html?id=${randomRecipe.id}`;
            }, 1500);

        } catch (error) {
            console.error('Failed to get random recipe:', error);
            alert('Failed to load recipes. Please try again.');
        }
    }

    showLoadingAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'random-recipe-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <i class="fas fa-dice" style="font-size: 5rem; animation: spin 1s linear infinite; color: var(--primary);"></i>
                <h2 style="margin-top: 2rem; font-size: 2rem; animation: pulse 1s infinite;">Finding your perfect recipe...</h2>
                <p style="margin-top: 1rem; font-size: 1.2rem; color: rgba(255,255,255,0.8);">Get ready for something delicious!</p>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
            }

            .surprise-me-btn:hover {
                animation: none !important;
                transform: scale(1.05) rotate(5deg);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize random recipe generator
window.RandomRecipe = new RandomRecipe();
