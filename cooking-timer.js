// Cooking Timer Widget
class CookingTimer {
    constructor() {
        this.timeRemaining = 0;
        this.intervalId = null;
        this.isPaused = false;
        this.widget = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.addStyles();
    }

    createWidget() {
        this.widget = document.createElement('div');
        this.widget.className = 'cooking-timer-widget';
        this.widget.id = 'cooking-timer';
        this.widget.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 1.5rem;
            z-index: 9999;
            display: none;
            min-width: 280px;
        `;

        this.widget.innerHTML = `
            <div class="timer-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="margin: 0; color: var(--dark); display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-clock"></i> Cooking Timer
                </h4>
                <button class="timer-close-btn" style="background: none; border: none; cursor: pointer; color: var(--gray); font-size: 1.2rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="timer-display" style="text-align: center; font-size: 3rem; font-weight: 700; color: var(--primary); margin: 1.5rem 0; font-family: 'Courier New', monospace;">
                00:00
            </div>
            
            <div class="timer-input" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--dark); font-weight: 600;">Set Time (minutes):</label>
                <input type="number" class="timer-minutes-input input-field" min="1" max="180" value="25" style="width: 100%; text-align: center;">
            </div>
            
            <div class="timer-controls" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button class="timer-start-btn btn btn-primary" style="flex: 1;">
                    <i class="fas fa-play"></i> Start
                </button>
                <button class="timer-pause-btn btn btn-outline" style="flex: 1; display: none;">
                    <i class="fas fa-pause"></i> Pause
                </button>
                <button class="timer-reset-btn btn btn-outline">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
            
            <div class="timer-progress" style="height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden;">
                <div class="timer-progress-bar" style="height: 100%; width: 0%; background: var(--gradient-main); transition: width 0.3s ease;"></div>
            </div>
        `;

        document.body.appendChild(this.widget);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const closeBtn = this.widget.querySelector('.timer-close-btn');
        const startBtn = this.widget.querySelector('.timer-start-btn');
        const pauseBtn = this.widget.querySelector('.timer-pause-btn');
        const resetBtn = this.widget.querySelector('.timer-reset-btn');
        const input = this.widget.querySelector('.timer-minutes-input');

        closeBtn.addEventListener('click', () => this.hide());
        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.pause());
        resetBtn.addEventListener('click', () => this.reset());

        input.addEventListener('change', () => {
            if (!this.intervalId) {
                this.updateDisplay(input.value * 60);
            }
        });
    }

    show(defaultMinutes = 25) {
        this.widget.style.display = 'block';
        this.widget.style.animation = 'slideInUp 0.3s ease';
        const input = this.widget.querySelector('.timer-minutes-input');
        input.value = defaultMinutes;
        this.updateDisplay(defaultMinutes * 60);
    }

    hide() {
        this.widget.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            this.widget.style.display = 'none';
            this.reset();
        }, 300);
    }

    start() {
        if (this.intervalId) return;

        const input = this.widget.querySelector('.timer-minutes-input');
        const minutes = parseInt(input.value) || 25;

        if (this.timeRemaining === 0) {
            this.timeRemaining = minutes * 60;
        }

        const totalTime = minutes * 60;
        const startBtn = this.widget.querySelector('.timer-start-btn');
        const pauseBtn = this.widget.querySelector('.timer-pause-btn');

        startBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
        input.disabled = true;

        this.intervalId = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay(this.timeRemaining);
            this.updateProgress(this.timeRemaining, totalTime);

            if (this.timeRemaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;

            const startBtn = this.widget.querySelector('.timer-start-btn');
            const pauseBtn = this.widget.querySelector('.timer-pause-btn');

            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            startBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
        }
    }

    reset() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.timeRemaining = 0;
        const input = this.widget.querySelector('.timer-minutes-input');
        const minutes = parseInt(input.value) || 25;

        this.updateDisplay(minutes * 60);
        this.updateProgress(0, 100);

        const startBtn = this.widget.querySelector('.timer-start-btn');
        const pauseBtn = this.widget.querySelector('.timer-pause-btn');

        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
        input.disabled = false;
    }

    complete() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.timeRemaining = 0;

        // Play notification sound (if available)
        this.playNotificationSound();

        // Show notification
        this.showNotification();

        // Reset UI
        this.reset();
    }

    updateDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const display = this.widget.querySelector('.timer-display');
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        // Change color when time is running out
        if (seconds <= 60 && seconds > 0) {
            display.style.color = 'var(--primary)';
            display.style.animation = 'pulse 1s infinite';
        } else {
            display.style.color = 'var(--primary)';
            display.style.animation = 'none';
        }
    }

    updateProgress(current, total) {
        const progressBar = this.widget.querySelector('.timer-progress-bar');
        const percentage = ((total - current) / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Cooking Timer', {
                body: 'Your timer has finished!',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">⏰</text></svg>'
            });
        } else {
            // Fallback to custom notification
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary);
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                font-size: 1.2rem;
                font-weight: 700;
                animation: bounceIn 0.5s ease;
            `;
            toast.innerHTML = '<i class="fas fa-bell"></i> Timer Complete! 🎉';
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes bounceIn {
                0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
                50% { transform: translateX(-50%) scale(1.05); }
                70% { transform: translateX(-50%) scale(0.9); }
                100% { transform: translateX(-50%) scale(1); opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            :root[data-theme="dark"] .cooking-timer-widget {
                background: rgba(45, 49, 57, 0.95) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize cooking timer
window.CookingTimer = new CookingTimer();

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
