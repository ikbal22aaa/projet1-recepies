// Comments System for Recipes
class CommentsSystem {
    constructor() {
        this.comments = this.loadComments();
    }

    loadComments() {
        const stored = localStorage.getItem('recipeComments');
        return stored ? JSON.parse(stored) : {};
    }

    saveComments() {
        localStorage.setItem('recipeComments', JSON.stringify(this.comments));
    }

    getComments(recipeId) {
        return this.comments[recipeId] || [];
    }

    addComment(recipeId, commentText) {
        if (!this.comments[recipeId]) {
            this.comments[recipeId] = [];
        }

        const session = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || 'null');
        const userName = session ? session.name : 'Anonymous';

        const comment = {
            id: Date.now(),
            recipeId: recipeId,
            userName: userName,
            text: commentText,
            timestamp: new Date().toISOString(),
            userId: session ? session.email : 'anonymous'
        };

        this.comments[recipeId].unshift(comment);
        this.saveComments();
        return comment;
    }

    deleteComment(recipeId, commentId) {
        if (!this.comments[recipeId]) return false;

        const index = this.comments[recipeId].findIndex(c => c.id === commentId);
        if (index > -1) {
            this.comments[recipeId].splice(index, 1);
            this.saveComments();
            return true;
        }
        return false;
    }

    canDeleteComment(comment) {
        const session = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || 'null');
        if (!session) return false;
        return comment.userId === session.email;
    }

    createCommentsSection(recipeId) {
        const section = document.createElement('div');
        section.className = 'comments-section glass-card';
        section.style.cssText = 'padding: 2rem; margin-top: 3rem;';

        const title = document.createElement('h3');
        title.textContent = 'Reviews & Comments';
        title.style.marginBottom = '1.5rem';
        section.appendChild(title);

        // Comment form
        const form = this.createCommentForm(recipeId, section);
        section.appendChild(form);

        // Comments list
        const commentsList = document.createElement('div');
        commentsList.className = 'comments-list';
        commentsList.id = `comments-list-${recipeId}`;
        section.appendChild(commentsList);

        this.renderComments(recipeId, commentsList);

        return section;
    }

    createCommentForm(recipeId, section) {
        const form = document.createElement('form');
        form.className = 'comment-form';
        form.style.cssText = 'margin-bottom: 2rem;';

        const textarea = document.createElement('textarea');
        textarea.className = 'input-field';
        textarea.placeholder = 'Share your thoughts about this recipe...';
        textarea.rows = 3;
        textarea.style.cssText = 'width: 100%; margin-bottom: 1rem; resize: vertical;';
        textarea.required = true;

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.innerHTML = '<i class="fas fa-comment"></i> Post Comment';

        form.appendChild(textarea);
        form.appendChild(submitBtn);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = textarea.value.trim();
            if (text) {
                this.addComment(recipeId, text);
                textarea.value = '';
                const commentsList = document.getElementById(`comments-list-${recipeId}`);
                this.renderComments(recipeId, commentsList);
            }
        });

        return form;
    }

    renderComments(recipeId, container) {
        const comments = this.getComments(recipeId);

        if (comments.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="far fa-comments" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = comments.map(comment => this.createCommentHTML(comment)).join('');

        // Add delete listeners
        container.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const commentId = parseInt(btn.dataset.commentId);
                if (confirm('Delete this comment?')) {
                    this.deleteComment(recipeId, commentId);
                    this.renderComments(recipeId, container);
                }
            });
        });
    }

    createCommentHTML(comment) {
        const date = new Date(comment.timestamp);
        const timeAgo = this.getTimeAgo(date);
        const canDelete = this.canDeleteComment(comment);

        const avatarColor = this.getAvatarColor(comment.userName);
        const initial = comment.userName.charAt(0).toUpperCase();

        return `
            <div class="comment-item" style="display: flex; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div class="comment-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: ${avatarColor}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                    ${initial}
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div>
                            <strong style="color: var(--dark);">${comment.userName}</strong>
                            <span style="color: var(--gray); font-size: 0.85rem; margin-left: 0.5rem;">${timeAgo}</span>
                        </div>
                        ${canDelete ? `
                            <button class="delete-comment-btn" data-comment-id="${comment.id}" style="background: none; border: none; color: var(--gray); cursor: pointer; padding: 0.25rem 0.5rem; transition: color 0.2s;">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                    <p style="color: var(--dark); line-height: 1.6; margin: 0;">${this.escapeHtml(comment.text)}</p>
                </div>
            </div>
        `;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    }

    getAvatarColor(name) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize comments system
window.CommentsSystem = new CommentsSystem();

// Add hover effect for delete button
const style = document.createElement('style');
style.textContent = `
    .delete-comment-btn:hover {
        color: var(--primary) !important;
    }
`;
document.head.appendChild(style);
