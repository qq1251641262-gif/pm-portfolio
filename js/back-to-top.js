/**
 * 返回顶部按钮组件
 * 可复用的返回顶部功能，支持平滑滚动、响应式设计、可访问性
 */
(function() {
    'use strict';

    const BackToTop = {
        config: {
            scrollThreshold: 300,
            scrollDuration: 500,
            showOnScrollUp: false,
            position: { right: '24px', bottom: '24px' },
            zIndex: 9999,
            buttonSize: 48,
            showShadow: true
        },

        element: null,

        init(options = {}) {
            Object.assign(this.config, options);
            this.createButton();
            this.bindEvents();
            this.updateVisibility();
            console.log('[BackToTop] Initialized');
        },

        createButton() {
            const btn = document.createElement('button');
            btn.id = 'back-to-top-btn';
            btn.className = 'back-to-top-btn';
            btn.setAttribute('aria-label', '返回顶部');
            btn.setAttribute('aria-hidden', 'false');
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('type', 'button');

            btn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            `;

            const style = `
                position: fixed;
                ${this.config.position ? `right: ${this.config.position.right}; bottom: ${this.config.position.bottom};` : ''}
                z-index: ${this.config.zIndex};
                width: ${this.config.buttonSize}px;
                height: ${this.config.buttonSize}px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                box-shadow: ${this.config.showShadow ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'};
            `;

            btn.setAttribute('style', style);

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = this.config.showShadow ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
            });

            btn.addEventListener('focus', () => {
                btn.style.outline = '2px solid #764ba2';
                btn.style.outlineOffset = '2px';
            });

            btn.addEventListener('blur', () => {
                btn.style.outline = 'none';
            });

            document.body.appendChild(btn);
            this.element = btn;
        },

        bindEvents() {
            this.handleScroll = this.throttle(this.updateVisibility.bind(this), 100);
            window.addEventListener('scroll', this.handleScroll, { passive: true });

            this.element.addEventListener('click', () => this.scrollToTop());

            this.element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });

            window.addEventListener('resize', this.throttle(this.updateVisibility.bind(this), 100), { passive: true });
        },

        updateVisibility() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = scrollTop > this.config.scrollThreshold;

            if (shouldShow) {
                this.element.style.opacity = '1';
                this.element.style.visibility = 'visible';
                this.element.style.transform = 'translateY(0)';
                this.element.setAttribute('aria-hidden', 'false');
            } else {
                this.element.style.opacity = '0';
                this.element.style.visibility = 'hidden';
                this.element.style.transform = 'translateY(20px)';
                this.element.setAttribute('aria-hidden', 'true');
            }
        },

        scrollToTop() {
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            const duration = this.config.scrollDuration;

            const easeOutQuad = (t) => t * (2 - t);

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easeOutQuad(progress);

                window.scrollTo(0, startPosition * (1 - easeProgress));

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        },

        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        destroy() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
            window.removeEventListener('scroll', this.handleScroll);
        },

        show() {
            if (this.element) {
                this.element.style.opacity = '1';
                this.element.style.visibility = 'visible';
                this.element.style.transform = 'translateY(0)';
            }
        },

        hide() {
            if (this.element) {
                this.element.style.opacity = '0';
                this.element.style.visibility = 'hidden';
                this.element.style.transform = 'translateY(20px)';
            }
        }
    };

    window.BackToTop = BackToTop;
})();
