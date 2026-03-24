/**
 * 组合式轮播图组件
 * 左侧主图展示区 + 右侧缩略图导航区
 */

class AdvancedCarousel {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            console.error('Carousel container not found');
            return;
        }

        // 配置参数
        this.config = {
            images: options.images || [],
            autoPlay: options.autoPlay !== false,
            autoPlayInterval: options.autoPlayInterval || 5000,
            transitionDuration: options.transitionDuration || 500,
            thumbnailsVisible: options.thumbnailsVisible || 4,
            ...options
        };

        // 状态
        this.currentIndex = 0;
        this.isPlaying = true;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // 初始化
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.startAutoPlay();
    }

    render() {
        const { images } = this.config;
        
        // 预加载前 3 张图片
        this.preloadImages(images.slice(0, 3));
        
        this.container.innerHTML = `
            <div class="carousel-wrapper">
                <!-- 左侧主图区域 -->
                <div class="carousel-main">
                    <div class="carousel-main-inner">
                        ${images.map((img, index) => `
                            <div class="carousel-main-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <div class="image-wrapper">
                                    <img src="${img.src}" alt="${img.alt || ''}" 
                                         loading="${index === 0 ? 'eager'" : 'lazy'}" 
                                         fetchpriority="${index === 0 ? 'high' : 'low'}"
                                         class="carousel-image ${index === 0 ? 'loaded' : ''}"
                                         onload="this.classList.add('loaded'); this.nextElementSibling?.remove()"
                                         onerror="this.classList.add('error'); this.nextElementSibling?.remove()">
                                    ${img.title ? `
                                        <div class="image-overlay">
                                            <div class="image-info">
                                                <h3 class="image-title">${img.title}</h3>
                                                <p class="image-desc">${img.description || ''}</p>
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${index === 0 ? '<div class="image-loading">加载中...</div>' : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 左右切换按钮 -->
                    <button class="carousel-arrow carousel-arrow-prev" aria-label="Previous">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-arrow carousel-arrow-next" aria-label="Next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <!-- 右侧缩略图区域 -->
                <div class="carousel-thumbnails">
                    <div class="thumbnails-track">
                        ${images.map((img, index) => `
                            <div class="thumbnail-item ${index === 0 ? 'active' : ''}" 
                                 data-index="${index}" 
                                 tabindex="0"
                                 role="button"
                                 aria-label="View image ${index + 1}">
                                <img src="${img.src}" alt="${img.alt || ''}" loading="lazy" class="thumbnail-image">
                                <div class="thumbnail-overlay"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        this.addStyles();
        
        // 预加载下一张图片
        setTimeout(() => this.preloadNextImage(), 1000);
    }

    preloadImages(imageList) {
        imageList.forEach(img => {
            const image = new Image();
            image.src = img.src;
        });
    }

    preloadNextImage() {
        const nextIndex = (this.currentIndex + 1) % this.config.images.length;
        const nextImage = this.config.images[nextIndex];
        const image = new Image();
        image.src = nextImage.src;
        
        // 预加载缩略图
        const thumbnailImages = this.container.querySelectorAll('.thumbnail-image');
        thumbnailImages.forEach((thumb, index) => {
            if (index <= this.currentIndex + 2 && !thumb.src) {
                thumb.src = this.config.images[index].src;
            }
        });
    }

    addStyles() {
        const styleId = 'carousel-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .carousel-wrapper {
                display: flex;
                gap: 20px;
                height: 600px;
                position: relative;
            }

            /* 左侧主图区域 - 70% */
            .carousel-main {
                flex: 0 0 70%;
                position: relative;
                overflow: hidden;
                border-radius: 12px;
                background: #f5f5f5;
            }

            .carousel-main-inner {
                position: relative;
                height: 100%;
            }

            .carousel-main-item {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                visibility: hidden;
                transition: opacity ${this.config.transitionDuration}ms ease,
                            visibility ${this.config.transitionDuration}ms ease;
            }

            .carousel-main-item.active {
                opacity: 1;
                visibility: visible;
                z-index: 1;
            }

            .image-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .carousel-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .carousel-image.loaded {
                opacity: 1;
            }

            .carousel-image.error {
                display: none;
            }

            .image-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #666;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .image-loading::after {
                content: '';
                width: 20px;
                height: 20px;
                border: 2px solid #e0e0e0;
                border-top-color: #6EA4D2;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .image-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
                padding: 40px 30px 30px;
                color: white;
            }

            .image-title {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
            }

            .image-desc {
                font-size: 16px;
                opacity: 0.9;
            }

            /* 切换按钮 */
            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 10;
                backdrop-filter: blur(10px);
            }

            .carousel-arrow:hover {
                background: white;
                transform: translateY(-50%) scale(1.1);
            }

            .carousel-arrow-prev {
                left: 20px;
            }

            .carousel-arrow-next {
                right: 20px;
            }

            .carousel-arrow i {
                color: #333;
                font-size: 18px;
            }

            /* 右侧缩略图区域 - 30% */
            .carousel-thumbnails {
                flex: 0 0 30%;
                overflow-y: auto;
                border-radius: 12px;
                background: #f9f9f9;
                padding: 15px;
            }

            .thumbnails-track {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .thumbnail-item {
                position: relative;
                width: 100%;
                aspect-ratio: 16/9;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                outline: none;
            }

            .thumbnail-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
                background: #e0e0e0;
            }

            .thumbnail-item img:not([src]) {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }

            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .thumbnail-item:hover img {
                transform: scale(1.05);
            }

            .thumbnail-item.active {
                border-color: #6EA4D2;
                box-shadow: 0 4px 12px rgba(110, 164, 210, 0.4);
            }

            .thumbnail-item.active img {
                transform: scale(1.02);
            }

            .thumbnail-overlay {
                position: absolute;
                inset: 0;
                background: rgba(110, 164, 210, 0);
                transition: background 0.3s ease;
            }

            .thumbnail-item.active .thumbnail-overlay {
                background: rgba(110, 164, 210, 0.1);
            }

            /* 响应式设计 - 移动端上下布局 */
            @media (max-width: 768px) {
                .carousel-wrapper {
                    flex-direction: column;
                    height: auto;
                }

                .carousel-main {
                    flex: none;
                    width: 100%;
                    height: 400px;
                }

                .carousel-thumbnails {
                    flex: none;
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;
                }

                .thumbnails-track {
                    grid-template-columns: repeat(4, 1fr);
                    flex-direction: row;
                    padding-bottom: 10px;
                    min-width: max-content;
                }

                .thumbnail-item {
                    width: 100px;
                    flex: 0 0 100px;
                }

                .thumbnail-item {
                    flex: 0 0 120px;
                    width: 120px;
                }

                .image-title {
                    font-size: 20px;
                }

                .image-desc {
                    font-size: 14px;
                }

                .carousel-arrow {
                    width: 40px;
                    height: 40px;
                }

                .carousel-arrow i {
                    font-size: 16px;
                }
            }

            /* 自定义滚动条 */
            .carousel-thumbnails::-webkit-scrollbar {
                width: 6px;
            }

            .carousel-thumbnails::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .carousel-thumbnails::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }

            .carousel-thumbnails::-webkit-scrollbar-thumb:hover {
                background: #a1a1a1;
            }

            /* 移动端横向滚动条 */
            @media (max-width: 768px) {
                .carousel-thumbnails::-webkit-scrollbar {
                    height: 6px;
                    width: auto;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    bindEvents() {
        // 缩略图点击
        this.container.querySelectorAll('.thumbnail-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.goToSlide(index);
            });

            // 键盘导航
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const index = parseInt(item.dataset.index);
                    this.goToSlide(index);
                }
            });
        });

        // 左右箭头按钮
        const prevBtn = this.container.querySelector('.carousel-arrow-prev');
        const nextBtn = this.container.querySelector('.carousel-arrow-next');

        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        // 触摸滑动
        this.container.querySelector('.carousel-main').addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.stopAutoPlay();
        });

        this.container.querySelector('.carousel-main').addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        });

        this.container.querySelector('.carousel-main').addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.startAutoPlay();
        });

        // 鼠标悬停暂停
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;

        const mainItems = this.container.querySelectorAll('.carousel-main-item');
        const thumbnailItems = this.container.querySelectorAll('.thumbnail-item');

        // 更新主图
        mainItems[this.currentIndex]?.classList.remove('active');
        mainItems[index]?.classList.add('active');

        // 更新缩略图
        thumbnailItems[this.currentIndex]?.classList.remove('active');
        thumbnailItems[index]?.classList.add('active');

        // 懒加载图片
        const img = mainItems[index]?.querySelector('.carousel-image');
        if (img && !img.classList.contains('loaded')) {
            img.src = this.config.images[index].src;
        }

        // 滚动缩略图到可视区域
        this.scrollThumbnailIntoView(index);

        this.currentIndex = index;

        // 触发事件
        this.container.dispatchEvent(new CustomEvent('carouselChange', {
            detail: { index, item: this.config.images[index] }
        }));
    }

    prev() {
        const newIndex = (this.currentIndex - 1 + this.config.images.length) % this.config.images.length;
        this.goToSlide(newIndex);
    }

    next() {
        const newIndex = (this.currentIndex + 1) % this.config.images.length;
        this.goToSlide(newIndex);
    }

    scrollThumbnailIntoView(index) {
        const thumbnailItems = this.container.querySelectorAll('.thumbnail-item');
        const activeThumbnail = thumbnailItems[index];
        
        if (activeThumbnail) {
            const container = this.container.querySelector('.carousel-thumbnails');
            const containerRect = container.getBoundingClientRect();
            const thumbnailRect = activeThumbnail.getBoundingClientRect();

            if (thumbnailRect.top < containerRect.top || thumbnailRect.bottom > containerRect.bottom) {
                activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    startAutoPlay() {
        if (!this.config.autoPlay || this.isPlaying) return;

        this.timer = setInterval(() => {
            this.next();
        }, this.config.autoPlayInterval);

        this.isPlaying = true;
    }

    stopAutoPlay() {
        if (!this.timer) return;

        clearInterval(this.timer);
        this.timer = null;
        this.isPlaying = false;
    }

    // 公开方法
    play() {
        this.startAutoPlay();
    }

    pause() {
        this.stopAutoPlay();
    }

    refresh() {
        this.currentIndex = 0;
        this.render();
        this.bindEvents();
        this.startAutoPlay();
    }

    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-carousel]').forEach(container => {
        const options = JSON.parse(container.dataset.carousel || '{}');
        new AdvancedCarousel(container, options);
    });
});
