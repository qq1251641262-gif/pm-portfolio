/**
 * AI Demo 数据加载器
 * 从静态 JSON 文件加载 AI Demo 数据
 * 
 * @author 张伟健
 * @version 1.0.0
 * @date 2026-03-24
 */

class AIDemosLoader {
    constructor() {
        this.data = null;
        this.baseUrl = '';
    }

    /**
     * 加载 AI Demo 数据
     * @returns {Promise<Array>} AI Demo 数据数组
     */
    async loadData() {
        try {
            const response = await fetch(`${this.baseUrl}data/ai-demos.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            console.log('AI Demo 数据加载成功:', this.data.length, '个项目');
            return this.data;
        } catch (error) {
            console.error('加载 AI Demo 数据失败:', error);
            return [];
        }
    }

    /**
     * 获取所有 AI Demo
     * @returns {Array} AI Demo 数组
     */
    getAllDemos() {
        return this.data || [];
    }

    /**
     * 根据 ID 获取 AI Demo
     * @param {number} id - Demo ID
     * @returns {Object|null} AI Demo 对象
     */
    getDemoById(id) {
        if (!this.data) return null;
        return this.data.find(demo => demo.id === parseInt(id)) || null;
    }

    /**
     * 根据项目 ID 获取 AI Demo
     * @param {number} projectId - 项目 ID
     * @returns {Object|null} AI Demo 对象
     */
    getDemoByProjectId(projectId) {
        if (!this.data) return null;
        return this.data.find(demo => demo.project_id === parseInt(projectId)) || null;
    }

    /**
     * 获取激活的 Demo
     * @returns {Array} 激活的 AI Demo 数组
     */
    getActiveDemos() {
        if (!this.data) return [];
        return this.data.filter(demo => demo.is_active === 1);
    }

    /**
     * 获取 Demo 图标路径
     * @param {number} demoId - Demo ID
     * @param {string} iconType - 图标类型 (main, favicon_16, favicon_32, apple_touch)
     * @returns {string} 图标路径
     */
    getIconPath(demoId, iconType = 'main') {
        const demo = this.getDemoById(demoId);
        if (!demo || !demo.icons) return '';
        return demo.icons[iconType] || demo.icons.main || '';
    }

    /**
     * 渲染 AI Demo 卡片
     * @param {Object} demo - AI Demo 数据对象
     * @returns {string} HTML 字符串
     */
    renderDemoCard(demo) {
        if (!demo) return '';
        
        const iconPath = demo.icons?.main || demo.icon_path || '';
        const hasIcon = iconPath && !iconPath.includes('undefined');
        
        return `
            <a href="${demo.demo_url}" target="_blank" 
               class="bg-[#F9F9F1] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow block group">
                <div class="h-48 bg-gradient-to-br ${demo.gradient} flex items-center justify-center relative overflow-hidden">
                    ${hasIcon ? `
                        <img src="${iconPath}" alt="${demo.title}" 
                             class="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110">
                    ` : `
                        <i class="fas ${demo.icon} text-6xl text-white opacity-80 transition-transform duration-300 group-hover:scale-110"></i>
                    `}
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-2">${demo.title}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2">${demo.description}</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                        ${(demo.technologies || []).slice(0, 3).map(tech => 
                            `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            </a>
        `;
    }

    /**
     * 渲染所有 AI Demo 卡片
     * @param {string} containerSelector - 容器选择器
     */
    async renderAllDemoCards(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('找不到容器:', containerSelector);
            return;
        }

        if (!this.data) {
            await this.loadData();
        }

        const activeDemos = this.getActiveDemos().sort((a, b) => a.sort_order - b.sort_order);
        
        if (activeDemos.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">暂无 AI Demo 项目</p>';
            return;
        }

        container.innerHTML = `
            <div class="grid md:grid-cols-3 gap-8">
                ${activeDemos.map(demo => this.renderDemoCard(demo)).join('')}
            </div>
        `;
    }
}

// 创建全局实例
const aiDemosLoader = new AIDemosLoader();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIDemosLoader;
}
