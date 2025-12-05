// Mock Data for Recipe App - Enhanced with LocalStorage
// This replaces PHP API calls with local data persistence

const INITIAL_RECIPES = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        category: "dinner",
        time: 25,
        servings: 4,
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
        description: "A creamy Italian pasta dish with eggs, cheese, and pancetta.",
        average_rating: 4.5,
        rating_count: 128,
        ingredients: ["400g spaghetti", "200g pancetta", "4 eggs", "100g parmesan cheese", "Black pepper", "Salt"],
        instructions: [
            "Cook spaghetti according to package directions",
            "Cut pancetta into small cubes and cook until crispy",
            "Beat eggs with parmesan cheese and black pepper",
            "Drain pasta and mix with pancetta",
            "Remove from heat and quickly stir in egg mixture",
            "Serve immediately with extra parmesan"
        ]
    },
    {
        id: 2,
        title: "Chocolate Chip Pancakes",
        category: "breakfast",
        time: 15,
        servings: 3,
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        description: "Fluffy pancakes loaded with chocolate chips, perfect for breakfast.",
        average_rating: 4.8,
        rating_count: 95,
        ingredients: ["2 cups flour", "2 eggs", "1 cup milk", "1/2 cup chocolate chips", "2 tbsp sugar", "1 tsp baking powder"],
        instructions: [
            "Mix flour, sugar, and baking powder in a bowl",
            "Beat eggs and milk together",
            "Combine wet and dry ingredients",
            "Fold in chocolate chips",
            "Cook on griddle until bubbles form",
            "Flip and cook until golden brown"
        ]
    },
    {
        id: 3,
        title: "Grilled Salmon with Herbs",
        category: "dinner",
        time: 20,
        servings: 2,
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
        description: "Fresh salmon grilled with aromatic herbs and lemon.",
        average_rating: 4.2,
        rating_count: 67,
        ingredients: ["2 salmon fillets", "2 tbsp olive oil", "Fresh dill", "Fresh parsley", "Lemon", "Salt and pepper"],
        instructions: [
            "Preheat grill to medium-high",
            "Season salmon with salt and pepper",
            "Brush with olive oil",
            "Grill for 4-5 minutes per side",
            "Garnish with fresh herbs and lemon",
            "Serve immediately"
        ]
    },
    {
        id: 4,
        title: "Caesar Salad",
        category: "lunch",
        time: 10,
        servings: 2,
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400",
        description: "Classic Caesar salad with crispy romaine and homemade dressing.",
        average_rating: 4.0,
        rating_count: 43,
        ingredients: ["1 head romaine lettuce", "1/2 cup parmesan cheese", "Croutons", "Caesar dressing", "Anchovies"],
        instructions: [
            "Wash and chop romaine lettuce",
            "Make Caesar dressing",
            "Toss lettuce with dressing",
            "Add croutons and parmesan",
            "Top with anchovies if desired",
            "Serve immediately"
        ]
    },
    {
        id: 5,
        title: "Chocolate Lava Cake",
        category: "dessert",
        time: 30,
        servings: 4,
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
        description: "Decadent chocolate cake with molten center, served warm.",
        average_rating: 4.7,
        rating_count: 78,
        ingredients: ["200g dark chocolate", "100g butter", "4 eggs", "100g sugar", "50g flour", "Vanilla extract"],
        instructions: [
            "Preheat oven to 200°C",
            "Melt chocolate and butter together",
            "Beat eggs and sugar until fluffy",
            "Fold in chocolate mixture and flour",
            "Pour into ramekins",
            "Bake for 12-15 minutes until edges are set"
        ]
    },
    {
        id: 6,
        title: "Avocado Toast",
        category: "breakfast",
        time: 5,
        servings: 1,
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=400",
        description: "Simple and healthy avocado toast with sea salt and lemon.",
        average_rating: 4.1,
        rating_count: 52,
        ingredients: ["2 slices bread", "1 ripe avocado", "Lemon juice", "Sea salt", "Red pepper flakes"],
        instructions: [
            "Toast bread slices",
            "Mash avocado with lemon juice",
            "Season with sea salt",
            "Spread on toast",
            "Sprinkle with red pepper flakes",
            "Serve immediately"
        ]
    }
];

// Helper to get recipes from storage
function getStoredRecipes() {
    const stored = localStorage.getItem('recipes');
    if (!stored) {
        localStorage.setItem('recipes', JSON.stringify(INITIAL_RECIPES));
        return INITIAL_RECIPES;
    }
    return JSON.parse(stored);
}

// Helper to save recipes to storage
function saveStoredRecipes(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Mock API functions
window.MockAPI = {
    // Get all recipes with optional filtering
    getRecipes: function (filters = {}) {
        let recipes = getStoredRecipes();

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            recipes = recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.category && filters.category !== 'all') {
            recipes = recipes.filter(recipe => recipe.category === filters.category);
        }

        if (filters.max_time) {
            recipes = recipes.filter(recipe => recipe.time <= parseInt(filters.max_time));
        }

        if (filters.difficulty && filters.difficulty !== 'all') {
            recipes = recipes.filter(recipe => recipe.difficulty === filters.difficulty);
        }

        if (filters.min_rating) {
            recipes = recipes.filter(recipe => recipe.average_rating >= parseFloat(filters.min_rating));
        }

        return Promise.resolve(recipes);
    },

    // Get single recipe with ingredients and instructions
    getRecipe: function (id) {
        const recipes = getStoredRecipes();
        const recipe = recipes.find(r => r.id === parseInt(id));

        if (!recipe) {
            return Promise.reject(new Error('Recipe not found'));
        }

        return Promise.resolve(recipe);
    },

    // Add new recipe
    addRecipe: function (recipeData) {
        const recipes = getStoredRecipes();
        const newId = Math.max(...recipes.map(r => r.id), 0) + 1;

        const newRecipe = {
            id: newId,
            ...recipeData,
            image: recipeData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
            average_rating: 0,
            rating_count: 0,
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || []
        };

        recipes.push(newRecipe);
        saveStoredRecipes(recipes);

        return Promise.resolve({ success: true, id: newId });
    },

    // Rate a recipe
    rateRecipe: function (recipeId, rating) {
        const recipes = getStoredRecipes();
        const recipeIndex = recipes.findIndex(r => r.id === parseInt(recipeId));

        if (recipeIndex === -1) {
            return Promise.reject(new Error('Recipe not found'));
        }

        const recipe = recipes[recipeIndex];

        // Update rating
        const oldCount = recipe.rating_count || 0;
        const oldAverage = recipe.average_rating || 0;

        recipe.rating_count = oldCount + 1;
        recipe.average_rating = (oldAverage * oldCount + rating) / recipe.rating_count;

        recipes[recipeIndex] = recipe;
        saveStoredRecipes(recipes);

        return Promise.resolve({ success: true });
    }
};

console.log("🍳 Mock API loaded - Persistent Storage Enabled");
