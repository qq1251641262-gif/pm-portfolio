/**
 * 产品经理作品集 - 数据埋点统计工具
 * 用于追踪 HR 访客对网站各模块和项目的兴趣度
 * 
 * 埋点类型：
 * 1. 页面浏览 (Page View)
 * 2. 模块曝光 (Section View)
 * 3. 点击交互 (Click Event)
 * 4. 停留时长 (Time Spent)
 * 5. 滚动深度 (Scroll Depth)
 */

(function() {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        // 是否启用埋点（生产环境设为 true）
        enabled: true,
        // 是否输出调试日志
        debug: true,
        // 数据上报方式：'console' | 'localStorage' | 'api'
        reportMethod: 'localStorage',
        // API 端点（如果使用 API 上报）
        apiEndpoint: '/api/analytics',
        // 滚动深度阈值（%）
        scrollThresholds: [25, 50, 75, 90],
        // 停留时长上报间隔（秒）
        timeSpentInterval: 10,
        // 防抖延迟（毫秒）
        debounceDelay: 1000
    };

    // ==================== 数据存储 ====================
    const analyticsData = {
        // 会话信息
        sessionId: generateSessionId(),
        startTime: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        screenResolution: `${screen.width}x${screen.height}`,
        
        // 页面浏览记录
        pageViews: [],
        
        // 模块曝光记录
        sectionViews: {},
        
        // 点击事件记录
        clickEvents: [],
        
        // 滚动深度记录
        scrollDepth: {
            max: 0,
            thresholds: []
        },
        
        // 项目交互记录
        projectInteractions: {},
        
        // 停留时长（毫秒）
        timeSpent: 0
    };

    // ==================== 工具函数 ====================
    
    /**
     * 生成会话 ID
     */
    function generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 生成唯一事件 ID
     */
    function generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 日志输出（调试模式）
     */
    function log(message, data = null) {
        if (CONFIG.debug) {
            console.log(`[Analytics] ${message}`, data || '');
        }
    }

    /**
     * 获取当前时间戳
     */
    function getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * 获取当前页面信息
     */
    function getCurrentPageInfo() {
        return {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            timestamp: getTimestamp()
        };
    }

    // ==================== 数据上报 ====================
    
    /**
     * 上报数据
     */
    function reportData(eventType, eventData) {
        if (!CONFIG.enabled) return;

        const data = {
            eventId: generateEventId(),
            sessionId: analyticsData.sessionId,
            eventType,
            eventData,
            timestamp: getTimestamp(),
            pageInfo: getCurrentPageInfo()
        };

        // 根据配置的上报方式处理
        switch (CONFIG.reportMethod) {
            case 'console':
                log(`Event: ${eventType}`, data);
                break;
            
            case 'localStorage':
                saveToLocalStorage(data);
                break;
            
            case 'api':
                sendToAPI(data);
                break;
        }

        return data;
    }

    /**
     * 保存到 localStorage
     */
    function saveToLocalStorage(data) {
        try {
            const key = 'portfolio_analytics';
            let existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(data);
            localStorage.setItem(key, JSON.stringify(existing));
            log('Saved to localStorage', data);
        } catch (e) {
            log('Failed to save to localStorage', e);
        }
    }

    /**
     * 发送到 API
     */
    async function sendToAPI(data) {
        try {
            await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            log('Sent to API', data);
        } catch (e) {
            log('Failed to send to API', e);
        }
    }

    // ==================== 埋点方法 ====================
    
    /**
     * 1. 页面浏览埋点
     */
    function trackPageView(pageName = null, pageType = 'home') {
        const pageData = {
            pageName: pageName || getPageNameFromPath(),
            pageType: pageType,
            loadTime: performance.now()
        };

        analyticsData.pageViews.push({
            ...pageData,
            ...getCurrentPageInfo()
        });

        reportData('page_view', pageData);
        log('Page View tracked', pageData);
    }

    /**
     * 从路径获取页面名称
     */
    function getPageNameFromPath() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index';
    }

    /**
     * 2. 模块曝光埋点
     */
    function trackSectionView(sectionId, sectionName, element = null) {
        if (analyticsData.sectionViews[sectionId]) return; // 避免重复上报
        
        // 从元素中获取 pageType 和 projectId 信息
        let pageType = 'homepage';
        let projectId = null;
        let projectName = null;
        
        if (element) {
            pageType = element.dataset.pageType || 'homepage';
            projectId = element.dataset.projectId || null;
            projectName = element.dataset.projectName || null;
        }
        
        analyticsData.sectionViews[sectionId] = {
            sectionId,
            sectionName,
            firstViewTime: getTimestamp(),
            viewCount: 1
        };
        
        const reportedData = reportData('section_view', {
            sectionId,
            sectionName,
            pageType,
            projectId,
            projectName
        });
        
        log('Section View tracked', { sectionId, sectionName, pageType, projectId, projectName });
        log('Section View saved to localStorage', reportedData);
    }

    /**
     * 3. 点击交互埋点
     */
    function trackClick(elementId, elementName, elementType = 'button', metadata = {}) {
        const clickData = {
            elementId,
            elementName,
            elementType,
            clickTime: getTimestamp(),
            ...metadata
        };
        
        analyticsData.clickEvents.push(clickData);
        reportData('click', clickData);
        log('Click tracked', clickData);
    }

    /**
     * 4. 项目交互埋点
     */
    function trackProjectInteraction(projectId, projectName, action, metadata = {}) {
        if (!analyticsData.projectInteractions[projectId]) {
            analyticsData.projectInteractions[projectId] = {
                projectId,
                projectName,
                interactions: []
            };
        }
        
        const interaction = {
            action,
            timestamp: getTimestamp(),
            ...metadata
        };
        
        analyticsData.projectInteractions[projectId].interactions.push(interaction);
        
        reportData('project_interaction', {
            projectId,
            projectName,
            action,
            ...metadata
        });
        
        log('Project Interaction tracked', { projectId, projectName, action });
    }

    /**
     * 5. 滚动深度埋点
     */
    function trackScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / scrollHeight) * 100) || 0;
        
        // 更新最大滚动深度
        if (scrollPercent > analyticsData.scrollDepth.max) {
            analyticsData.scrollDepth.max = scrollPercent;
            
            // 检查是否达到新的阈值
            CONFIG.scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !analyticsData.scrollDepth.thresholds.includes(threshold)) {
                    analyticsData.scrollDepth.thresholds.push(threshold);
                    reportData('scroll_depth', {
                        threshold,
                        maxScroll: scrollPercent
                    });
                }
            });
        }
    }

    /**
     * 6. 停留时长埋点
     */
    function trackTimeSpent() {
        analyticsData.timeSpent += CONFIG.timeSpentInterval * 1000;
        
        reportData('time_spent', {
            totalSeconds: Math.round(analyticsData.timeSpent / 1000),
            pageViews: analyticsData.pageViews.length
        });
    }

    /**
     * 7. 表单提交埋点
     */
    function trackFormSubmit(formId, formName, success = true, formData = {}) {
        reportData('form_submit', {
            formId,
            formName,
            success,
            submitTime: getTimestamp(),
            ...formData
        });
    }

    /**
     * 8. 文件下载埋点
     */
    function trackFileDownload(fileName, fileType = 'pdf') {
        reportData('file_download', {
            fileName,
            fileType,
            downloadTime: getTimestamp()
        });
    }

    /**
     * 9. 外部链接点击埋点
     */
    function trackExternalLink(url, linkName, linkType = 'demo') {
        reportData('external_link', {
            url,
            linkName,
            linkType,
            clickTime: getTimestamp()
        });
    }

    /**
     * 10. 视频/媒体播放埋点
     */
    function trackMediaPlay(mediaId, mediaName, action = 'play', currentTime = 0) {
        reportData('media_interaction', {
            mediaId,
            mediaName,
            action, // play, pause, ended, seek
            currentTime,
            timestamp: getTimestamp()
        });
    }

    /**
     * 11. 文档交互埋点
     * 跟踪文档详情页内的图片交互（悬停/点击），每个文档仅统计一次
     */
    const trackedDocuments = new Set();
    
    function trackDocumentInteraction(documentId, interactionType) {
        if (trackedDocuments.has(documentId)) {
            log('Document already tracked:', documentId);
            return;
        }
        
        trackedDocuments.add(documentId);
        
        reportData('document_interaction', {
            documentId,
            interactionType, // hover, click
            timestamp: getTimestamp()
        });
        
        log('Document interaction tracked', { documentId, interactionType });
    }

    /**
     * 12. 演示链接点击埋点
     * 二元跟踪：点击=1，未点击=0
     */
    let demoLinkClickedInSession = false;
    
    function trackDemoLinkClick(linkInfo = {}) {
        if (demoLinkClickedInSession) {
            log('Demo link already clicked in this session');
            return;
        }
        
        demoLinkClickedInSession = true;
        
        reportData('demo_link_click', {
            demoLinkClicked: true,
            linkInfo,
            timestamp: getTimestamp()
        });
        
        log('Demo link click tracked', { linkInfo });
    }

    /**
     * 13. 通用自定义事件埋点
     */
    function reportCustomEvent(eventType, eventData = {}) {
        reportData(eventType, {
            ...eventData,
            timestamp: getTimestamp()
        });
        
        log('Custom event tracked', { eventType, eventData });
    }

    // ==================== 自动追踪 ====================
    
    /**
     * 初始化 Intersection Observer 追踪模块曝光
     */
    function initSectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // 30% 可见时触发
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    // 优先使用 id，其次使用 data-section-name
                    const sectionId = section.id || section.dataset.sectionName || generateEventId();
                    // 优先使用 data-section-name，其次使用 id
                    const sectionName = section.dataset.sectionName || section.id || 'Unknown';
                    
                    log('Section intersecting', { sectionId, sectionName, dataset: section.dataset });
                    
                    if (sectionId) {
                        trackSectionView(sectionId, sectionName, section);
                    }
                }
            });
        }, observerOptions);

        // 观察所有带 data-track-section 的元素
        const sections = document.querySelectorAll('[data-track-section]');
        log('Found sections to track:', sections.length);
        
        sections.forEach(section => {
            observer.observe(section);
            log('Observing section:', section.dataset.sectionName || section.id);
        });

        log('Section observer initialized, tracking', sections.length, 'sections');
    }

    /**
     * 初始化点击事件代理
     */
    function initClickTracking() {
        document.addEventListener('click', (e) => {
            const trackedElement = e.target.closest('[data-track-click]');
            if (!trackedElement) return;

            const elementId = trackedElement.id || generateEventId();
            const elementName = trackedElement.dataset.trackClick || trackedElement.textContent?.trim() || 'Unknown';
            const elementType = trackedElement.tagName.toLowerCase();
            
            // 特殊处理：项目卡片点击
            const projectCard = trackedElement.closest('.project-card, .demo-card');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId || elementId;
                const projectName = projectCard.dataset.projectName || elementName;
                trackProjectInteraction(projectId, projectName, 'card_click', {
                    elementId,
                    elementName
                });
            } else {
                trackClick(elementId, elementName, elementType);
            }
        });

        log('Click tracking initialized');
    }

    /**
     * 初始化滚动追踪
     */
    function initScrollTracking() {
        const scrollHandler = debounce(() => {
            trackScrollDepth();
        }, CONFIG.debounceDelay);

        window.addEventListener('scroll', scrollHandler, { passive: true });
        log('Scroll tracking initialized');
    }

    /**
     * 初始化页面可见性追踪
     */
    function initVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                log('Page became visible');
            } else {
                // 页面隐藏时上报停留时长
                trackTimeSpent();
            }
        });
    }

    /**
     * 初始化下载链接追踪
     */
    function initDownloadTracking() {
        document.querySelectorAll('a[download], a[href*=".pdf"], a[href*=".zip"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const fileName = href.split('/').pop();
                const fileType = fileName.split('.').pop() || 'unknown';
                
                trackFileDownload(fileName, fileType);
            });
        });

        log('Download tracking initialized');
    }

    /**
     * 初始化外部链接追踪
     */
    function initExternalLinkTracking() {
        document.querySelectorAll('a[target="_blank"], a[href^="http"]').forEach(link => {
            // 排除本站链接
            if (link.hostname === window.location.hostname) return;

            link.addEventListener('click', (e) => {
                const url = link.href;
                const linkName = link.textContent?.trim() || link.dataset.linkName || 'External Link';
                const linkType = link.dataset.linkType || 'external';
                
                trackExternalLink(url, linkName, linkType);
            });
        });

        log('External link tracking initialized');
    }

    // ==================== 数据导出 ====================
    
    /**
     * 获取所有埋点数据
     */
    function getAnalyticsData() {
        return {
            ...analyticsData,
            endTime: Date.now(),
            totalDuration: Date.now() - analyticsData.startTime
        };
    }

    /**
     * 导出为 JSON
     */
    function exportAsJSON() {
        return JSON.stringify(getAnalyticsData(), null, 2);
    }

    /**
     * 导出为 CSV
     */
    function exportAsCSV() {
        const events = analyticsData.clickEvents.map(event => ({
            timestamp: event.clickTime,
            type: 'click',
            element: event.elementName,
            projectId: event.projectId || ''
        }));

        const csvRows = events.map(event => 
            `"${event.timestamp}","${event.type}","${event.element}","${event.projectId}"`
        );

        return ['Timestamp,Type,Element,ProjectID', ...csvRows].join('\n');
    }

    /**
     * 清除 localStorage 数据
     */
    function clearStoredData() {
        localStorage.removeItem('portfolio_analytics');
        log('Stored data cleared');
    }

    /**
     * 获取 localStorage 中的数据
     */
    function getStoredData() {
        try {
            const key = 'portfolio_analytics';
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            log('Failed to get stored data', e);
            return [];
        }
    }

    // ==================== 初始化 ====================
    
    /**
     * 初始化所有埋点功能
     */
    function init() {
        if (!CONFIG.enabled) {
            log('Analytics is disabled');
            return;
        }

        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeTrackers);
        } else {
            initializeTrackers();
        }

        function initializeTrackers() {
            // 自动追踪页面浏览
            trackPageView();

            // 初始化各种追踪器
            initSectionObserver();
            initClickTracking();
            initScrollTracking();
            initVisibilityTracking();
            initDownloadTracking();
            initExternalLinkTracking();

            // 定时上报停留时长
            setInterval(() => {
                trackTimeSpent();
            }, CONFIG.timeSpentInterval * 1000);

            // 页面卸载时上报最终数据
            window.addEventListener('beforeunload', () => {
                trackTimeSpent();
                // 使用 sendBeacon 确保数据发送成功
                if (navigator.sendBeacon && CONFIG.reportMethod === 'api') {
                    const blob = new Blob([exportAsJSON()], { type: 'application/json' });
                    navigator.sendBeacon(CONFIG.apiEndpoint, blob);
                }
            });

            log('Analytics initialized successfully', {
                sessionId: analyticsData.sessionId,
                reportMethod: CONFIG.reportMethod
            });
        }
    }

    // ==================== 导出 API ====================
    
    // 暴露全局 API
    window.Analytics = {
        // 初始化
        init,
        
        // 手动追踪方法
        trackPageView,
        trackSectionView,
        trackClick,
        trackProjectInteraction,
        trackFormSubmit,
        trackFileDownload,
        trackExternalLink,
        trackMediaPlay,
        trackDocumentInteraction,
        trackDemoLinkClick,
        reportCustomEvent,
        
        // 数据导出
        getData: getAnalyticsData,
        exportAsJSON,
        exportAsCSV,
        getStoredData,
        clearStoredData,
        
        // 配置
        getConfig: () => CONFIG,
        setConfig: (newConfig) => Object.assign(CONFIG, newConfig)
    };

    // 自动初始化（如果 enabled 为 true）- 延迟到 DOMContentLoaded 确保 DOM 已准备好
    if (CONFIG.enabled) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                init();
                log('Analytics auto-initialized on DOMContentLoaded');
            });
        } else {
            // DOM 已经加载完成
            init();
            log('Analytics auto-initialized immediately');
        }
    }

    log('Analytics module loaded');
})();
