/**
 * 静态数据加载器
 * 用于从本地JSON文件加载数据并渲染到页面
 */

const DataLoader = {
    // 数据基础路径
    basePath: 'data/',

    /**
     * 加载JSON数据
     * @param {string} filename - JSON文件名（不含扩展名）
     * @returns {Promise<any>} - 解析后的数据
     */
    async load(filename) {
        try {
            const response = await fetch(`${this.basePath}${filename}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    },

    /**
     * 加载个人资料
     */
    async loadProfile() {
        return await this.load('profile');
    },

    /**
     * 加载技能列表
     */
    async loadSkills() {
        return await this.load('skills');
    },

    /**
     * 加载工作经历
     */
    async loadExperiences() {
        return await this.load('experiences');
    },

    /**
     * 加载教育经历
     */
    async loadEducation() {
        return await this.load('education');
    },

    /**
     * 加载项目列表
     */
    async loadProjects() {
        return await this.load('projects');
    },

    /**
     * 加载单个项目详情
     * @param {number} projectId - 项目ID
     */
    async loadProject(projectId) {
        const projects = await this.loadProjects();
        if (!projects) return null;
        return projects.find(p => p.id === parseInt(projectId));
    },

    /**
     * 加载AI Demo列表
     */
    async loadAIDemos() {
        return await this.load('ai-demos');
    },

    /**
     * 加载网站设置
     */
    async loadSettings() {
        return await this.load('settings');
    }
};

// 页面渲染器
const PageRenderer = {
    /**
     * 渲染技能列表到页面
     */
    async renderSkills() {
        const skills = await DataLoader.loadSkills();
        if (!skills) return;

        // 按分类分组
        const categories = {};
        skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = [];
            }
            categories[skill.category].push(skill);
        });

        // 渲染到页面
        const container = document.getElementById('skills-container');
        if (!container) return;

        container.innerHTML = Object.entries(categories).map(([category, items]) => `
            <div class="mb-8">
                <h3 class="text-xl font-bold mb-4" style="color: var(--color-primary);">${category}</h3>
                <div class="flex flex-wrap gap-3">
                    ${items.map(skill => `
                        <span class="skill-tag px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm" 
                              style="color: var(--text-primary); border: 1px solid var(--color-primary);">
                            ${skill.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    /**
     * 渲染工作经历
     */
    async renderExperiences() {
        const experiences = await DataLoader.loadExperiences();
        if (!experiences) return;

        const container = document.getElementById('experience-container');
        if (!container) return;

        container.innerHTML = experiences.map(exp => `
            <div class="timeline-item relative pl-8 pb-8 border-l-2 border-[#6EA4D2] last:border-0">
                <div class="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#6EA4D2]"></div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex flex-wrap justify-between items-start mb-2">
                        <h3 class="text-xl font-bold" style="color: var(--text-primary);">${exp.position}</h3>
                        <span class="text-sm text-gray-500">${exp.start_date} - ${exp.is_current ? '至今' : exp.end_date}</span>
                    </div>
                    <p class="text-lg mb-2" style="color: var(--color-primary);">${exp.company}</p>
                    <p class="text-gray-600 mb-2">${exp.description}</p>
                    <p class="text-sm text-gray-500"><strong>主要成就：</strong>${exp.achievements}</p>
                </div>
            </div>
        `).join('');
    },

    /**
     * 渲染教育经历
     */
    async renderEducation() {
        const education = await DataLoader.loadEducation();
        if (!education) return;

        const container = document.getElementById('education-container');
        if (!container) return;

        container.innerHTML = education.map(edu => `
            <div class="timeline-item relative pl-8 pb-8 border-l-2 border-[#8B9DC5] last:border-0">
                <div class="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#8B9DC5]"></div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex flex-wrap justify-between items-start mb-2">
                        <h3 class="text-xl font-bold" style="color: var(--text-primary);">${edu.school}</h3>
                        <span class="text-sm text-gray-500">${edu.start_date} - ${edu.is_current ? '至今' : edu.end_date}</span>
                    </div>
                    <p class="text-lg mb-2" style="color: var(--color-secondary);">${edu.degree} · ${edu.major}</p>
                    <p class="text-gray-600">${edu.description}</p>
                    ${edu.achievements ? `<p class="text-sm text-gray-500 mt-2"><strong>荣誉：</strong>${edu.achievements}</p>` : ''}
                </div>
            </div>
        `).join('');
    },

    /**
     * 渲染项目列表
     */
    async renderProjects() {
        const projects = await DataLoader.loadProjects();
        if (!projects) return;

        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="h-48 bg-gradient-to-br from-[#6EA4D2] to-[#8B9DC5] flex items-center justify-center relative overflow-hidden">
                    <i class="fas fa-folder-open text-6xl text-white opacity-80"></i>
                    <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
                </div>
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${project.tags.slice(0, 3).map(tag => `
                            <span class="text-xs px-2 py-1 rounded-full bg-[#E9E7F5] text-[#6EA4D2]">${tag}</span>
                        `).join('')}
                    </div>
                    <h3 class="text-xl font-bold mb-2" style="color: var(--text-primary);">${project.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${project.description}</p>
                    <div class="flex gap-3">
                        <a href="${project.detail_url}" class="flex-1 text-center py-2 rounded-lg border border-[#6EA4D2] text-[#6EA4D2] hover:bg-[#6EA4D2] hover:text-white transition-colors">
                            查看详情
                        </a>
                        <a href="${project.demo_url}" target="_blank" class="flex-1 text-center py-2 rounded-lg bg-[#6EA4D2] text-white hover:bg-[#5a93c2] transition-colors">
                            AI Demo
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * 渲染AI Demo列表
     */
    async renderAIDemos() {
        const demos = await DataLoader.loadAIDemos();
        if (!demos) return;

        const container = document.getElementById('ai-demos-container');
        if (!container) return;

        container.innerHTML = demos.map(demo => `
            <div class="demo-card bg-[#F9F9F1] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div class="h-48 bg-gradient-to-br ${demo.gradient} flex items-center justify-center">
                    <i class="fas ${demo.icon} text-6xl text-white opacity-80"></i>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary);">${demo.title}</h3>
                    <a href="${demo.demo_url}" target="_blank" class="text-sm hover:opacity-80" style="color: var(--color-primary);">
                        查看 Demo <i class="fas fa-external-link-alt ml-1"></i>
                    </a>
                </div>
            </div>
        `).join('');
    },

    /**
     * 渲染个人资料
     */
    async renderProfile() {
        const profile = await DataLoader.loadProfile();
        if (!profile) return;

        // 更新页面标题
        document.title = `${profile.name} - ${profile.title}`;

        // 更新个人介绍
        const nameElements = document.querySelectorAll('.profile-name');
        nameElements.forEach(el => el.textContent = profile.name);

        const titleElements = document.querySelectorAll('.profile-title');
        titleElements.forEach(el => el.textContent = profile.title);

        const bioElements = document.querySelectorAll('.profile-bio');
        bioElements.forEach(el => el.textContent = profile.bio);

        // 更新联系信息
        const emailElements = document.querySelectorAll('.profile-email');
        emailElements.forEach(el => {
            el.textContent = profile.email;
            el.href = `mailto:${profile.email}`;
        });
    },

    /**
     * 初始化页面渲染
     */
    async init() {
        await this.renderProfile();
        await this.renderSkills();
        await this.renderExperiences();
        await this.renderEducation();
        await this.renderProjects();
        await this.renderAIDemos();
    }
};

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', () => {
    PageRenderer.init();
});
