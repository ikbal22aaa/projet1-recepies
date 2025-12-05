// Rating System for Recipes
class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
    }

    loadRatings() {
        const stored = localStorage.getItem('recipeRatings');
        return stored ? JSON.parse(stored) : {};
    }

    saveRatings() {
        localStorage.setItem('recipeRatings', JSON.stringify(this.ratings));
    }

    getUserRating(recipeId) {
        return this.ratings[recipeId] || 0;
    }

    setRating(recipeId, rating) {
        this.ratings[recipeId] = rating;
        this.saveRatings();

        // Update the recipe's average rating in mock API
        if (window.MockAPI && window.MockAPI.rateRecipe) {
            window.MockAPI.rateRecipe(recipeId, rating);
        }
    }

    createStarRating(recipeId, currentRating = 0, interactive = false) {
        const container = document.createElement('div');
        container.className = 'star-rating';
        container.setAttribute('data-recipe-id', recipeId);

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= currentRating ? 'fas fa-star' : 'far fa-star';
            star.setAttribute('data-rating', i);

            if (interactive) {
                star.style.cursor = 'pointer';
                star.addEventListener('click', () => this.handleStarClick(recipeId, i, container));
                star.addEventListener('mouseenter', () => this.handleStarHover(i, container));
            }

            container.appendChild(star);
        }

        if (interactive) {
            container.addEventListener('mouseleave', () => {
                const userRating = this.getUserRating(recipeId);
                this.updateStars(container, userRating);
            });
        }

        return container;
    }

    handleStarClick(recipeId, rating, container) {
        this.setRating(recipeId, rating);
        this.updateStars(container, rating);

        // Show feedback
        this.showRatingFeedback(container, rating);
    }

    handleStarHover(rating, container) {
        this.updateStars(container, rating);
    }

    updateStars(container, rating) {
        const stars = container.querySelectorAll('i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.className = 'fas fa-star';
            } else {
                star.className = 'far fa-star';
            }
        });
    }

    showRatingFeedback(container, rating) {
        const feedback = document.createElement('span');
        feedback.className = 'rating-feedback';
        feedback.textContent = `You rated this ${rating} star${rating !== 1 ? 's' : ''}!`;
        feedback.style.cssText = `
            margin-left: 10px;
            color: var(--primary);
            font-weight: 600;
            animation: fadeIn 0.3s ease;
        `;

        // Remove existing feedback
        const existing = container.parentNode.querySelector('.rating-feedback');
        if (existing) existing.remove();

        container.parentNode.appendChild(feedback);

        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    createDisplayRating(averageRating, ratingCount = 0) {
        const container = document.createElement('div');
        container.className = 'rating-display';
        container.style.cssText = 'display: flex; align-items: center; gap: 0.3rem;';

        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        starsContainer.style.cssText = 'display: flex; gap: 2px; color: #f1c40f;';

        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < fullStars) {
                star.className = 'fas fa-star';
            } else if (i === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            starsContainer.appendChild(star);
        }

        container.appendChild(starsContainer);

        const ratingText = document.createElement('span');
        ratingText.style.cssText = 'font-size: 0.9rem; color: var(--gray);';
        ratingText.textContent = `${averageRating.toFixed(1)}`;
        if (ratingCount > 0) {
            ratingText.textContent += ` (${ratingCount})`;
        }
        container.appendChild(ratingText);

        return container;
    }
}

// Initialize rating system
window.RatingSystem = new RatingSystem();

// Add CSS for rating animations
const style = document.createElement('style');
style.textContent = `
    .star-rating {
        display: flex;
        gap: 5px;
        font-size: 1.5rem;
        color: #f1c40f;
    }
    
    .star-rating i {
        transition: all 0.2s ease;
    }
    
    .star-rating i:hover {
        transform: scale(1.2);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
