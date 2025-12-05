// Trending Recipes Tracker
class TrendingTracker {
    constructor() {
        this.views = this.loadViews();
    }

    loadViews() {
        const stored = localStorage.getItem('recipeViews');
        return stored ? JSON.parse(stored) : {};
    }

    saveViews() {
        localStorage.setItem('recipeViews', JSON.stringify(this.views));
    }

    trackView(recipeId) {
        if (!this.views[recipeId]) {
            this.views[recipeId] = {
                count: 0,
                lastViewed: null,
                firstViewed: new Date().toISOString()
            };
        }

        this.views[recipeId].count++;
        this.views[recipeId].lastViewed = new Date().toISOString();
        this.saveViews();
    }

    getViewCount(recipeId) {
        return this.views[recipeId]?.count || 0;
    }

    async getTrendingRecipes(limit = 6) {
        try {
            const allRecipes = await window.MockAPI.getRecipes({});

            // Add view counts to recipes
            const recipesWithViews = allRecipes.map(recipe => ({
                ...recipe,
                viewCount: this.getViewCount(recipe.id)
            }));

            // Sort by view count
            recipesWithViews.sort((a, b) => b.viewCount - a.viewCount);

            // Return top recipes
            return recipesWithViews.slice(0, limit);

        } catch (error) {
            console.error('Failed to get trending recipes:', error);
            return [];
        }
    }

    async createTrendingSection() {
        const section = document.createElement('section');
        section.className = 'trending-section';
        section.style.cssText = 'padding: 4rem 0;';

        const container = document.createElement('div');
        container.className = 'container';

        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 3rem;';
        header.innerHTML = `
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <i class="fas fa-fire" style="color: var(--primary);"></i>
                Trending This Week
            </h2>
            <p style="color: var(--gray); font-size: 1.1rem;">Most popular recipes loved by our community</p>
        `;
        container.appendChild(header);

        const trendingRecipes = await this.getTrendingRecipes(6);

        if (trendingRecipes.length === 0 || trendingRecipes.every(r => r.viewCount === 0)) {
            // Show default popular recipes if no views yet
            const allRecipes = await window.MockAPI.getRecipes({});
            trendingRecipes.push(...allRecipes.slice(0, 6));
        }

        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.style.cssText = 'grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;';

        trendingRecipes.forEach((recipe, index) => {
            const card = this.createTrendingCard(recipe, index + 1);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);

        return section;
    }

    createTrendingCard(recipe, rank) {
        const card = document.createElement('div');
        card.className = 'glass-card trending-card';
        card.style.cssText = 'padding: 0; overflow: hidden; position: relative; cursor: pointer;';

        const badge = rank <= 3 ? `
            <div style="position: absolute; top: 1rem; left: 1rem; background: var(--gradient-main); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                ${rank}
            </div>
        ` : '';

        const viewBadge = recipe.viewCount > 0 ? `
            <div style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.7); color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 0.3rem; z-index: 10;">
                <i class="fas fa-eye"></i> ${recipe.viewCount}
            </div>
        ` : '';

        card.innerHTML = `
            ${badge}
            ${viewBadge}
            <div style="height: 200px; overflow: hidden;">
                <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;">
            </div>
            <div style="padding: 1.5rem;">
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${recipe.title}</h3>
                <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem;">${recipe.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--gray); font-size: 0.9rem;">
                        <i class="far fa-clock"></i> ${recipe.time} min
                    </span>
                    <span style="color: #f1c40f;">
                        <i class="fas fa-star"></i> ${recipe.average_rating?.toFixed(1) || 'New'}
                    </span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `recipe.html?id=${recipe.id}`;
        });

        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('img');
            img.style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('img');
            img.style.transform = 'scale(1)';
        });

        return card;
    }

    addTrendingBadge(recipeId) {
        const viewCount = this.getViewCount(recipeId);
        if (viewCount > 10) {
            const badge = document.createElement('span');
            badge.className = 'trending-badge';
            badge.innerHTML = '<i class="fas fa-fire"></i> Trending';
            badge.style.cssText = `
                background: var(--gradient-main);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
            `;
            return badge;
        }
        return null;
    }
}

// Initialize trending tracker
window.TrendingTracker = new TrendingTracker();
