// Recipe Collections Manager
class CollectionsManager {
    constructor() {
        this.collections = this.loadCollections();
    }

    loadCollections() {
        const stored = localStorage.getItem('recipeCollections');
        return stored ? JSON.parse(stored) : [];
    }

    saveCollections() {
        localStorage.setItem('recipeCollections', JSON.stringify(this.collections));
    }

    createCollection(name, description = '') {
        const collection = {
            id: Date.now(),
            name: name,
            description: description,
            recipes: [],
            createdAt: new Date().toISOString(),
            color: this.getRandomColor()
        };

        this.collections.push(collection);
        this.saveCollections();
        return collection;
    }

    deleteCollection(collectionId) {
        this.collections = this.collections.filter(c => c.id !== collectionId);
        this.saveCollections();
    }

    addRecipeToCollection(collectionId, recipeId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection && !collection.recipes.includes(recipeId)) {
            collection.recipes.push(recipeId);
            this.saveCollections();
            return true;
        }
        return false;
    }

    removeRecipeFromCollection(collectionId, recipeId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection) {
            collection.recipes = collection.recipes.filter(id => id !== recipeId);
            this.saveCollections();
            return true;
        }
        return false;
    }

    getCollections() {
        return this.collections;
    }

    getCollection(collectionId) {
        return this.collections.find(c => c.id === collectionId);
    }

    isRecipeInCollection(collectionId, recipeId) {
        const collection = this.getCollection(collectionId);
        return collection ? collection.recipes.includes(recipeId) : false;
    }

    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
            '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createAddToCollectionButton(recipeId) {
        const button = document.createElement('button');
        button.className = 'btn btn-outline';
        button.innerHTML = '<i class="fas fa-folder-plus"></i> Add to Collection';

        button.addEventListener('click', () => this.showCollectionModal(recipeId));

        return button;
    }

    showCollectionModal(recipeId) {
        const modal = document.createElement('div');
        modal.className = 'collection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'glass-card';
        modalContent.style.cssText = `
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 2rem;
            animation: slideInUp 0.3s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;';
        header.innerHTML = `
            <h3 style="margin: 0;"><i class="fas fa-folder"></i> Add to Collection</h3>
            <button class="close-modal-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--gray);">
                <i class="fas fa-times"></i>
            </button>
        `;

        const createNewSection = document.createElement('div');
        createNewSection.style.cssText = 'margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid rgba(0,0,0,0.1);';
        createNewSection.innerHTML = `
            <h4 style="margin-bottom: 1rem;">Create New Collection</h4>
            <input type="text" id="newCollectionName" class="input-field" placeholder="Collection name..." style="width: 100%; margin-bottom: 0.5rem;">
            <textarea id="newCollectionDesc" class="input-field" placeholder="Description (optional)" rows="2" style="width: 100%; margin-bottom: 1rem; resize: vertical;"></textarea>
            <button class="btn btn-primary create-collection-btn" style="width: 100%;">
                <i class="fas fa-plus"></i> Create Collection
            </button>
        `;

        const existingSection = document.createElement('div');
        existingSection.innerHTML = '<h4 style="margin-bottom: 1rem;">Your Collections</h4>';

        const collectionsList = document.createElement('div');
        collectionsList.className = 'collections-list';
        this.renderCollectionsList(collectionsList, recipeId);

        existingSection.appendChild(collectionsList);

        modalContent.appendChild(header);
        modalContent.appendChild(createNewSection);
        modalContent.appendChild(existingSection);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners
        header.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        createNewSection.querySelector('.create-collection-btn').addEventListener('click', () => {
            const name = document.getElementById('newCollectionName').value.trim();
            const desc = document.getElementById('newCollectionDesc').value.trim();

            if (name) {
                const collection = this.createCollection(name, desc);
                this.addRecipeToCollection(collection.id, recipeId);
                this.renderCollectionsList(collectionsList, recipeId);
                document.getElementById('newCollectionName').value = '';
                document.getElementById('newCollectionDesc').value = '';
                this.showToast('Collection created and recipe added!');
            }
        });
    }

    renderCollectionsList(container, recipeId) {
        const collections = this.getCollections();

        if (collections.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--gray); padding: 2rem;">
                    No collections yet. Create your first one above!
                </p>
            `;
            return;
        }

        container.innerHTML = collections.map(collection => {
            const isInCollection = this.isRecipeInCollection(collection.id, recipeId);
            return `
                <div class="collection-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.5rem; border-radius: 12px; background: rgba(0,0,0,0.02); border-left: 4px solid ${collection.color};">
                    <div>
                        <strong style="display: block; margin-bottom: 0.25rem;">${collection.name}</strong>
                        <small style="color: var(--gray);">${collection.recipes.length} recipe${collection.recipes.length !== 1 ? 's' : ''}</small>
                    </div>
                    <button class="toggle-collection-btn btn ${isInCollection ? 'btn-primary' : 'btn-outline'}" data-collection-id="${collection.id}" style="padding: 0.5rem 1rem;">
                        <i class="fas ${isInCollection ? 'fa-check' : 'fa-plus'}"></i>
                        ${isInCollection ? 'Added' : 'Add'}
                    </button>
                </div>
            `;
        }).join('');

        // Add event listeners
        container.querySelectorAll('.toggle-collection-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const collectionId = parseInt(btn.dataset.collectionId);
                const isInCollection = this.isRecipeInCollection(collectionId, recipeId);

                if (isInCollection) {
                    this.removeRecipeFromCollection(collectionId, recipeId);
                    this.showToast('Removed from collection');
                } else {
                    this.addRecipeToCollection(collectionId, recipeId);
                    this.showToast('Added to collection!');
                }

                this.renderCollectionsList(container, recipeId);
            });
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Initialize collections manager
window.CollectionsManager = new CollectionsManager();
