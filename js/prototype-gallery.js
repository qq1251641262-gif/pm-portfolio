/**
 * 原型展示模块组件
 * 用于在项目详情页展示原型图片，支持手动翻页浏览
 * 
 * @author 张伟健
 * @version 1.0.0
 * @date 2026-03-24
 */

class PrototypeGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`PrototypeGallery: Container #${containerId} not found`);
            return;
        }

        // 配置选项
        this.config = {
            projectId: options.projectId || 1,
            imagesPerPage: options.imagesPerPage || 4,
            imageHeight: options.imageHeight || 200,
            gap: options.gap || 16,
            ...options
        };

        // 状态
        this.currentPage = 0;
        this.images = [];
        this.totalPages = 0;
        this.isLoading = false;

        // 初始化
        this.init();
    }

    /**
     * 初始化组件
     */
    async init() {
        console.log(`PrototypeGallery: 开始初始化项目 ${this.config.projectId}`);
        this.renderSkeleton();
        await this.loadImages();
        
        console.log(`PrototypeGallery: 加载完成，共 ${this.images.length} 张图片`);
        
        // 如果没有图片，隐藏整个模块
        if (this.images.length === 0) {
            this.container.style.display = 'none';
            console.log(`PrototypeGallery: 项目 ${this.config.projectId} 没有图片，隐藏模块`);
            return;
        }

        this.totalPages = Math.ceil(this.images.length / this.config.imagesPerPage);
        console.log(`PrototypeGallery: 总页数 ${this.totalPages}`);
        this.render();
        this.bindEvents();
        this.updateDisplay();
        console.log(`PrototypeGallery: 项目 ${this.config.projectId} 初始化完成`);
    }

    /**
     * 渲染骨架屏
     */
    renderSkeleton() {
        this.container.innerHTML = `
            <div class="prototype-gallery">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">原型展示</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-500 gallery-counter">加载中...</span>
                    </div>
                </div>
                <div class="gallery-skeleton grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${Array(4).fill(0).map(() => `
                        <div class="bg-gray-200 rounded-lg animate-pulse" style="height: ${this.config.imageHeight}px;"></div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * 从JSON文件加载图片数据
     * 只加载原型图片(prototype_images)，不包含文档图片
     */
    async loadImages() {
        const jsonPath = `../data/project${this.config.projectId}-images.json`;
        console.log(`PrototypeGallery: 正在加载 ${jsonPath}`);
        
        try {
            const response = await fetch(jsonPath);
            console.log(`PrototypeGallery: 响应状态 ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`PrototypeGallery: JSON数据`, data);
            
            // 只加载原型图片，不加载文档图片
            this.images = (data.prototype_images || [])
                .sort((a, b) => a.sort_order - b.sort_order);

            console.log(`PrototypeGallery: 成功加载 ${this.images.length} 张原型图片`);
        } catch (error) {
            console.error(`PrototypeGallery: 加载失败:`, error);
            console.error(`PrototypeGallery: 请检查文件路径是否正确: ${jsonPath}`);
            this.images = [];
        }
    }

    /**
     * 渲染组件HTML
     */
    render() {
        const galleryHtml = `
            <div class="prototype-gallery bg-white rounded-2xl p-6 shadow-sm">
                <!-- 标题和控制区 -->
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">原型展示</h2>
                        <p class="text-sm text-gray-500 mt-1">项目界面原型与功能模块展示</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500 gallery-counter">
                            ${this.images.length} 个原型
                        </span>
                        <div class="flex gap-2">
                            <button class="gallery-prev-btn w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="上一页">
                                <i class="fas fa-chevron-left text-gray-600"></i>
                            </button>
                            <button class="gallery-next-btn w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="下一页">
                                <i class="fas fa-chevron-right text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 图片网格 -->
                <div class="gallery-grid grid grid-cols-2 md:grid-cols-${Math.min(this.config.imagesPerPage, 4)} gap-${this.config.gap / 4}" style="min-height: ${this.config.imageHeight}px;">
                    ${this.images.map((img, index) => `
                        <div class="gallery-item group relative rounded-xl overflow-hidden cursor-pointer bg-gray-100" 
                             data-index="${index}" 
                             style="height: ${this.config.imageHeight}px; display: none;">
                            <img src="../${img.path}" 
                                 alt="${img.title}" 
                                 class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 lazy-load"
                                 loading="lazy"
                                 data-src="../${img.path}">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 class="text-white font-semibold text-sm truncate">${img.title}</h3>
                                    <p class="text-white/80 text-xs mt-1 line-clamp-2">${img.subtitle}</p>
                                </div>
                            </div>
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    <i class="fas fa-expand-alt mr-1"></i>查看
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 分页指示器 -->
                ${this.totalPages > 1 ? `
                    <div class="flex justify-center mt-6 gap-2">
                        ${Array(this.totalPages).fill(0).map((_, i) => `
                            <button class="gallery-dot w-2 h-2 rounded-full bg-gray-300 transition-colors" data-page="${i}" aria-label="第${i + 1}页"></button>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- 空状态提示 -->
                <div class="gallery-empty hidden text-center py-12">
                    <i class="fas fa-images text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500">暂无原型图片</p>
                </div>
            </div>
        `;

        this.container.innerHTML = galleryHtml;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 上一页按钮
        const prevBtn = this.container.querySelector('.gallery-prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevPage());
        }

        // 下一页按钮
        const nextBtn = this.container.querySelector('.gallery-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }

        // 分页点
        const dots = this.container.querySelectorAll('.gallery-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            });
        });

        // 图片点击 - 打开大图预览
        const items = this.container.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(item.dataset.index);
                this.openLightbox(index);
            });
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (this.container.style.display === 'none') return;
            
            const lightbox = document.querySelector('.prototype-lightbox');
            if (lightbox) {
                // 大图预览模式下的键盘控制
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevImageInLightbox();
                if (e.key === 'ArrowRight') this.nextImageInLightbox();
            } else {
                // 画廊模式下的键盘控制
                if (e.key === 'ArrowLeft') this.prevPage();
                if (e.key === 'ArrowRight') this.nextPage();
            }
        });
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        const items = this.container.querySelectorAll('.gallery-item');
        const startIndex = this.currentPage * this.config.imagesPerPage;
        const endIndex = startIndex + this.config.imagesPerPage;

        items.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';
                // 添加淡入动画
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, (index - startIndex) * 50);
            } else {
                item.style.display = 'none';
            }
        });

        // 更新按钮状态
        const prevBtn = this.container.querySelector('.gallery-prev-btn');
        const nextBtn = this.container.querySelector('.gallery-next-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 0;
        if (nextBtn) nextBtn.disabled = this.currentPage >= this.totalPages - 1;

        // 更新分页点
        const dots = this.container.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentPage) {
                dot.classList.add('bg-blue-500');
                dot.classList.remove('bg-gray-300');
            } else {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-300');
            }
        });
    }

    /**
     * 上一页
     */
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateDisplay();
        }
    }

    /**
     * 下一页
     */
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateDisplay();
        }
    }

    /**
     * 跳转到指定页
     */
    goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.updateDisplay();
        }
    }

    /**
     * 打开大图预览
     */
    openLightbox(index) {
        const img = this.images[index];
        if (!img) return;

        // 创建大图预览DOM
        const lightbox = document.createElement('div');
        lightbox.className = 'prototype-lightbox fixed inset-0 z-50 bg-black/95 flex items-center justify-center';
        lightbox.innerHTML = `
            <div class="lightbox-content relative w-full h-full flex flex-col">
                <!-- 关闭按钮 -->
                <button class="lightbox-close absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <i class="fas fa-times text-white text-xl"></i>
                </button>
                
                <!-- 图片容器 -->
                <div class="flex-1 flex items-center justify-center p-8">
                    <button class="lightbox-prev absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                        <i class="fas fa-chevron-left text-white text-xl"></i>
                    </button>
                    
                    <img src="../${img.path}" alt="${img.title}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
                    
                    <button class="lightbox-next absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ${index === this.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                        <i class="fas fa-chevron-right text-white text-xl"></i>
                    </button>
                </div>
                
                <!-- 底部信息 -->
                <div class="bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div class="max-w-4xl mx-auto">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-blue-400 text-sm font-medium">${img.category === 'prototype' ? '原型' : '文档'}</span>
                            <span class="text-white/40 text-sm">${index + 1} / ${this.images.length}</span>
                        </div>
                        <h3 class="text-white text-xl font-bold mb-2">${img.title}</h3>
                        <p class="text-white/70 text-sm">${img.subtitle}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // 绑定大图预览事件
        this.currentLightboxIndex = index;
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImageInLightbox());
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.nextImageInLightbox());
        
        // 点击背景关闭
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
    }

    /**
     * 关闭大图预览
     */
    closeLightbox() {
        const lightbox = document.querySelector('.prototype-lightbox');
        if (lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
            this.currentLightboxIndex = null;
        }
    }

    /**
     * 大图预览上一张
     */
    prevImageInLightbox() {
        if (this.currentLightboxIndex > 0) {
            this.closeLightbox();
            this.openLightbox(this.currentLightboxIndex - 1);
        }
    }

    /**
     * 大图预览下一张
     */
    nextImageInLightbox() {
        if (this.currentLightboxIndex < this.images.length - 1) {
            this.closeLightbox();
            this.openLightbox(this.currentLightboxIndex + 1);
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrototypeGallery;
}
