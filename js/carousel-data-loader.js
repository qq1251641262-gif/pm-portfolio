/**
 * 轮播数据加载器
 * 从静态JSON数据库加载轮播图片数据，支持原型图片和文档图片聚合
 * 
 * @author 张伟健
 * @version 1.0.0
 * @date 2026-03-24
 */

class CarouselDataLoader {
    constructor(projectId) {
        this.projectId = projectId;
        this.data = null;
    }

    /**
     * 加载轮播数据
     * @returns {Promise<Array>} 轮播图片数组
     */
    async load() {
        try {
            const response = await fetch(`../data/project${this.projectId}-images.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            
            // 聚合原型图片和文档图片
            const allImages = [
                ...(this.data.prototype_images || []),
                ...(this.data.document_images || [])
            ].sort((a, b) => a.sort_order - b.sort_order);

            // 转换为轮播组件需要的格式
            const carouselImages = allImages.map(img => ({
                src: `../${img.path}`,
                alt: img.title,
                title: img.title,
                description: img.subtitle,
                category: img.category
            }));

            console.log(`CarouselDataLoader: 项目 ${this.projectId} 加载了 ${carouselImages.length} 张图片`);
            return carouselImages;

        } catch (error) {
            console.error('CarouselDataLoader: 加载数据失败:', error);
            // 返回空数组，让调用方处理错误
            return [];
        }
    }

    /**
     * 获取项目信息
     * @returns {Object|null}
     */
    getProjectInfo() {
        if (!this.data) return null;
        return {
            project_id: this.data.project_id,
            project_name: this.data.project_name,
            last_updated: this.data.last_updated
        };
    }

    /**
     * 获取图片总数
     * @returns {number}
     */
    getTotalImages() {
        if (!this.data) return 0;
        return (this.data.prototype_images?.length || 0) + 
               (this.data.document_images?.length || 0);
    }

    /**
     * 按类别获取图片
     * @param {string} category - 'prototype' 或 'document'
     * @returns {Array}
     */
    getImagesByCategory(category) {
        if (!this.data) return [];
        
        const images = category === 'prototype' 
            ? this.data.prototype_images 
            : this.data.document_images;
            
        return (images || []).map(img => ({
            src: `../${img.path}`,
            alt: img.title,
            title: img.title,
            description: img.subtitle,
            category: img.category
        }));
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarouselDataLoader;
}
