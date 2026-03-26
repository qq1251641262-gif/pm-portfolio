/**
 * 文档详情页跟踪组件
 * 用于跟踪文档详情页内的图片交互和演示链接点击
 */
(function() {
    'use strict';

    const DocumentTracker = {
        config: {
            sessionTimeout: 30 * 60 * 1000,
            debounceDelay: 300,
            storageKey: 'document_tracking_state'
        },

        state: {
            trackedDocuments: new Set(),
            demoLinkClicked: false,
            sessionId: null,
            sessionStartTime: null
        },

        init(options = {}) {
            Object.assign(this.config, options);
            this.state.sessionId = this.generateSessionId();
            this.state.sessionStartTime = Date.now();
            this.loadSessionState();
            this.initImageTracking();
            this.initDemoLinkTracking();
            this.setupVisibilityHandler();
            console.log('[DocumentTracker] Initialized', this.state);
        },

        generateSessionId() {
            return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        loadSessionState() {
            try {
                const stored = sessionStorage.getItem(this.config.storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    if (Date.now() - data.timestamp < this.config.sessionTimeout) {
                        this.state.trackedDocuments = new Set(data.trackedDocuments || []);
                        this.state.demoLinkClicked = data.demoLinkClicked || false;
                    } else {
                        this.clearSessionState();
                    }
                }
            } catch (e) {
                console.error('[DocumentTracker] Failed to load session state:', e);
            }
        },

        saveSessionState() {
            try {
                sessionStorage.setItem(this.config.storageKey, JSON.stringify({
                    trackedDocuments: Array.from(this.state.trackedDocuments),
                    demoLinkClicked: this.state.demoLinkClicked,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.error('[DocumentTracker] Failed to save session state:', e);
            }
        },

        clearSessionState() {
            sessionStorage.removeItem(this.config.storageKey);
            this.state.trackedDocuments.clear();
            this.state.demoLinkClicked = false;
        },

        initImageTracking() {
            const images = document.querySelectorAll('.doc-image, .document-image, [data-document-id]');
            
            images.forEach(img => {
                img.addEventListener('mouseenter', (e) => this.handleImageHover(e), { passive: true });
                img.addEventListener('click', (e) => this.handleImageClick(e), { passive: true });
            });

            if (images.length > 0) {
                console.log(`[DocumentTracker] Tracking ${images.length} document images`);
            }
        },

        handleImageHover(event) {
            const img = event.target.closest('.doc-image, .document-image, [data-document-id]');
            if (!img) return;

            const documentId = this.getDocumentId(img);
            this.trackDocumentInteraction(documentId, 'hover');
        },

        handleImageClick(event) {
            const img = event.target.closest('.doc-image, .document-image, [data-document-id]');
            if (!img) return;

            const documentId = this.getDocumentId(img);
            this.trackDocumentInteraction(documentId, 'click');
        },

        getDocumentId(element) {
            const projectId = element.dataset.projectId || this.getProjectIdFromPage();
            const documentId = element.dataset.documentId || element.src || this.generateDocumentId(element);
            return `${projectId}_${documentId}`;
        },

        getProjectIdFromPage() {
            const projectElement = document.querySelector('[data-project-id]');
            return projectElement ? projectElement.dataset.projectId : 'unknown';
        },

        generateDocumentId(element) {
            return 'doc_' + (element.src ? btoa(element.src).substr(0, 20) : Math.random().toString(36).substr(2, 9));
        },

        trackDocumentInteraction(documentId, interactionType) {
            if (this.state.trackedDocuments.has(documentId)) {
                console.log(`[DocumentTracker] Document already tracked: ${documentId}`);
                return;
            }

            this.state.trackedDocuments.add(documentId);
            this.saveSessionState();

            const eventData = {
                eventType: 'document_interaction',
                documentId: documentId,
                interactionType: interactionType,
                sessionId: this.state.sessionId,
                timestamp: new Date().toISOString(),
                pageInfo: {
                    url: window.location.href,
                    title: document.title
                }
            };

            this.reportData(eventData);
            console.log('[DocumentTracker] Document interaction tracked:', eventData);
        },

        initDemoLinkTracking() {
            const demoLinks = document.querySelectorAll('a[href*="demo"], a[href*="Demo"], .demo-link, [data-demo-link]');
            
            demoLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleDemoLinkClick(e), { passive: true });
            });

            if (demoLinks.length > 0) {
                console.log(`[DocumentTracker] Tracking ${demoLinks.length} demo links`);
            }
        },

        handleDemoLinkClick(event) {
            if (this.state.demoLinkClicked) {
                console.log('[DocumentTracker] Demo link already clicked in this session');
                return;
            }

            this.state.demoLinkClicked = true;
            this.saveSessionState();

            const link = event.target.closest('a');
            const linkInfo = {
                href: link.href,
                text: link.textContent.trim(),
                id: link.id || null,
                classes: link.className
            };

            const eventData = {
                eventType: 'demo_link_click',
                demoLinkClicked: true,
                linkInfo: linkInfo,
                sessionId: this.state.sessionId,
                timestamp: new Date().toISOString(),
                pageInfo: {
                    url: window.location.href,
                    title: document.title
                }
            };

            this.reportData(eventData);
            console.log('[DocumentTracker] Demo link click tracked:', eventData);
        },

        setupVisibilityHandler() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.finalizeSession();
                }
            });

            window.addEventListener('beforeunload', () => {
                this.finalizeSession();
            });
        },

        finalizeSession() {
            if (!this.state.demoLinkClicked && this.state.trackedDocuments.size > 0) {
                const eventData = {
                    eventType: 'session_summary',
                    demoLinkClicked: false,
                    documentsViewed: Array.from(this.state.trackedDocuments),
                    documentCount: this.state.trackedDocuments.size,
                    sessionId: this.state.sessionId,
                    sessionDuration: Date.now() - this.state.sessionStartTime,
                    timestamp: new Date().toISOString(),
                    pageInfo: {
                        url: window.location.href,
                        title: document.title
                    }
                };

                this.reportData(eventData);
                console.log('[DocumentTracker] Session finalized:', eventData);
            }
        },

        reportData(data) {
            if (window.Analytics && typeof window.Analytics.reportCustomEvent === 'function') {
                window.Analytics.reportCustomEvent(data.eventType, data);
            } else {
                const storageKey = 'portfolio_analytics';
                try {
                    let existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    existing.push({
                        eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        sessionId: this.state.sessionId,
                        eventType: data.eventType,
                        eventData: data,
                        timestamp: data.timestamp,
                        pageInfo: data.pageInfo
                    });
                    localStorage.setItem(storageKey, JSON.stringify(existing));
                } catch (e) {
                    console.error('[DocumentTracker] Failed to save data:', e);
                }
            }
        }
    };

    window.DocumentTracker = DocumentTracker;
})();
