// Social Share Functionality
class SocialShare {
    constructor() {
        this.init();
    }

    init() {
        // Add share button styles
        this.addStyles();
    }

    createShareButtons(recipeTitle, recipeUrl = window.location.href) {
        const container = document.createElement('div');
        container.className = 'social-share-buttons';
        container.style.cssText = 'display: flex; gap: 0.75rem; flex-wrap: wrap;';

        const shareData = {
            title: recipeTitle,
            url: recipeUrl,
            text: `Check out this amazing recipe: ${recipeTitle}`
        };

        // Check if Web Share API is available (mobile)
        if (navigator.share) {
            const nativeShareBtn = this.createShareButton(
                'Share',
                'fas fa-share-alt',
                '#667eea',
                () => this.nativeShare(shareData)
            );
            container.appendChild(nativeShareBtn);
        }

        // Facebook
        const facebookBtn = this.createShareButton(
            'Facebook',
            'fab fa-facebook-f',
            '#1877F2',
            () => this.shareToFacebook(shareData.url, shareData.title)
        );
        container.appendChild(facebookBtn);

        // Twitter
        const twitterBtn = this.createShareButton(
            'Twitter',
            'fab fa-twitter',
            '#1DA1F2',
            () => this.shareToTwitter(shareData.text, shareData.url)
        );
        container.appendChild(twitterBtn);

        // Pinterest
        const pinterestBtn = this.createShareButton(
            'Pinterest',
            'fab fa-pinterest-p',
            '#E60023',
            () => this.shareToPinterest(shareData.url, shareData.title)
        );
        container.appendChild(pinterestBtn);

        // WhatsApp
        const whatsappBtn = this.createShareButton(
            'WhatsApp',
            'fab fa-whatsapp',
            '#25D366',
            () => this.shareToWhatsApp(shareData.text, shareData.url)
        );
        container.appendChild(whatsappBtn);

        // Copy Link
        const copyBtn = this.createShareButton(
            'Copy Link',
            'fas fa-link',
            '#6c757d',
            () => this.copyLink(shareData.url)
        );
        container.appendChild(copyBtn);

        return container;
    }

    createShareButton(label, iconClass, color, onClick) {
        const button = document.createElement('button');
        button.className = 'share-btn';
        button.style.cssText = `
            background: ${color};
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            font-family: 'Outfit', sans-serif;
        `;

        button.innerHTML = `<i class="${iconClass}"></i> ${label}`;
        button.addEventListener('click', onClick);

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = `0 4px 12px ${color}66`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });

        return button;
    }

    async nativeShare(shareData) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Share cancelled or failed:', err);
        }
    }

    shareToFacebook(url, title) {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        this.openPopup(shareUrl, 'Facebook Share');
    }

    shareToTwitter(text, url) {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        this.openPopup(shareUrl, 'Twitter Share');
    }

    shareToPinterest(url, description) {
        const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`;
        this.openPopup(shareUrl, 'Pinterest Share');
    }

    shareToWhatsApp(text, url) {
        const message = `${text} ${url}`;
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(shareUrl, '_blank');
    }

    async copyLink(url) {
        try {
            await navigator.clipboard.writeText(url);
            this.showToast('Link copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast('Link copied to clipboard!', 'success');
            } catch (err) {
                this.showToast('Failed to copy link', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    openPopup(url, title) {
        const width = 600;
        const height = 400;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        window.open(
            url,
            title,
            `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
        );
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#4ECDC4' : '#FF6B6B'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            animation: slideInUp 0.3s ease;
        `;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(100%);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize social share
window.SocialShare = new SocialShare();
