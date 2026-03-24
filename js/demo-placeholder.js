/**
 * Demo预览缺省页面组件
 * 用于处理无可用demo时的用户体验
 * 
 * 使用方法:
 * 1. 在页面中引入此脚本: <script src="../js/demo-placeholder.js"></script>
 * 2. 调用 DemoPlaceholder.checkAndRedirect(projectId, demoUrl)
 * 
 * 强制显示缺省页面的项目ID列表: ['1236']
 */

const DemoPlaceholder = {
    // 强制显示缺省页面的项目ID列表
    forcePlaceholderIds: ['1236'],
    
    // 缺省页面路径
    placeholderUrl: '../works/demo-placeholder.html',
    
    /**
     * 检查是否应该显示缺省页面
     * @param {string|number} projectId - 项目ID
     * @param {string} demoUrl - Demo链接
     * @returns {boolean} - 是否显示缺省页面
     */
    shouldShowPlaceholder(projectId, demoUrl) {
        // 如果没有demo链接，显示缺省页面
        if (!demoUrl || demoUrl === '#' || demoUrl === '') {
            return true;
        }
        
        // 如果项目在强制显示列表中，显示缺省页面
        if (projectId && this.forcePlaceholderIds.includes(String(projectId))) {
            return true;
        }
        
        return false;
    },
    
    /**
     * 获取缺省页面URL（带参数）
     * @param {string|number} projectId - 项目ID
     * @param {string} demoUrl - 原始demo链接
     * @returns {string} - 缺省页面完整URL
     */
    getPlaceholderUrl(projectId, demoUrl) {
        const params = new URLSearchParams();
        if (projectId) params.append('id', projectId);
        if (demoUrl) params.append('demo', encodeURIComponent(demoUrl));
        return `${this.placeholderUrl}?${params.toString()}`;
    },
    
    /**
     * 检查并重定向
     * @param {string|number} projectId - 项目ID
     * @param {string} demoUrl - Demo链接
     * @returns {boolean} - 是否进行了重定向
     */
    checkAndRedirect(projectId, demoUrl) {
        if (this.shouldShowPlaceholder(projectId, demoUrl)) {
            const placeholderUrl = this.getPlaceholderUrl(projectId, demoUrl);
            window.location.href = placeholderUrl;
            return true;
        }
        return false;
    },
    
    /**
     * 在新窗口中打开Demo（带缺省页检查）
     * @param {string|number} projectId - 项目ID
     * @param {string} demoUrl - Demo链接
     * @param {string} target - 打开方式 ('_blank' 或 '_self')
     */
    openDemo(projectId, demoUrl, target = '_blank') {
        if (this.shouldShowPlaceholder(projectId, demoUrl)) {
            const placeholderUrl = this.getPlaceholderUrl(projectId, demoUrl);
            window.open(placeholderUrl, target);
        } else {
            window.open(demoUrl, target);
        }
    },
    
    /**
     * 获取Demo链接（用于a标签href）
     * @param {string|number} projectId - 项目ID
     * @param {string} demoUrl - Demo链接
     * @returns {string} - 处理后的链接
     */
    getDemoLink(projectId, demoUrl) {
        if (this.shouldShowPlaceholder(projectId, demoUrl)) {
            return this.getPlaceholderUrl(projectId, demoUrl);
        }
        return demoUrl;
    },
    
    /**
     * 添加项目到强制显示列表
     * @param {string|number} projectId - 项目ID
     */
    addForcePlaceholderId(projectId) {
        const id = String(projectId);
        if (!this.forcePlaceholderIds.includes(id)) {
            this.forcePlaceholderIds.push(id);
        }
    },
    
    /**
     * 从强制显示列表移除项目
     * @param {string|number} projectId - 项目ID
     */
    removeForcePlaceholderId(projectId) {
        const id = String(projectId);
        const index = this.forcePlaceholderIds.indexOf(id);
        if (index > -1) {
            this.forcePlaceholderIds.splice(index, 1);
        }
    },
    
    /**
     * 渲染内联缺省提示（用于在页面内显示，不跳转）
     * @param {HTMLElement} container - 容器元素
     * @param {Object} options - 配置选项
     */
    renderInline(container, options = {}) {
        const {
            title = '项目开发中',
            subtitle = '该项目的Demo正在紧锣密鼓地开发中',
            showProgress = true,
            showButtons = true,
            customClass = ''
        } = options;
        
        const html = `
            <div class="demo-placeholder-inline ${customClass}" style="
                background: linear-gradient(135deg, #E9E7F5 0%, #D9E8E3 100%);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                animation: fadeIn 0.6s ease-out;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, #6EA4D2, #8B9DC5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 2s ease-in-out infinite;
                ">
                    <i class="fas fa-tools" style="font-size: 32px; color: white;"></i>
                </div>
                <h3 style="font-size: 24px; font-weight: bold; color: #2C3E50; margin-bottom: 12px;">${title}</h3>
                <p style="font-size: 16px; color: #5D6D7E; margin-bottom: 20px;">${subtitle}</p>
                ${showProgress ? `
                <div style="max-width: 300px; margin: 0 auto 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #5D6D7E; margin-bottom: 8px;">
                        <span>开发进度</span>
                        <span>进行中...</span>
                    </div>
                    <div style="height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; background: linear-gradient(90deg, #6EA4D2, #6BBCCF); border-radius: 3px; animation: progress 3s ease-in-out infinite;"></div>
                    </div>
                </div>
                ` : ''}
                ${showButtons ? `
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="history.back()" style="
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #6EA4D2, #8B9DC5);
                        color: white;
                        border: none;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-arrow-left" style="margin-right: 6px;"></i>返回
                    </button>
                    <a href="../index.html#works" style="
                        padding: 10px 20px;
                        border: 2px solid #6EA4D2;
                        color: #6EA4D2;
                        text-decoration: none;
                        border-radius: 20px;
                        font-weight: 500;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#6EA4D2'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#6EA4D2'">
                        <i class="fas fa-th-large" style="margin-right: 6px;"></i>浏览其他
                    </a>
                </div>
                ` : ''}
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            </style>
        `;
        
        container.innerHTML = html;
    }
};

// 导出模块（支持CommonJS和ES6模块）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoPlaceholder;
}
