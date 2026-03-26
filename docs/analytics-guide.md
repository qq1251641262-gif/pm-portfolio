# 数据埋点使用指南

## 概述

本系统为产品经理作品集网站提供完整的数据埋点统计功能，帮助了解 HR 访客对网站各模块和项目的兴趣度。

## 埋点类型

### 1. 页面浏览 (Page View)
- **触发时机**: 页面加载完成
- **记录内容**: 页面 URL、标题、加载时间
- **用途**: 统计各页面访问量

### 2. 模块曝光 (Section View)
- **触发时机**: 模块进入视口 30% 以上
- **记录内容**: 模块 ID、模块名称、首次查看时间
- **用途**: 了解 HR 对哪些内容模块感兴趣

### 3. 点击交互 (Click Event)
- **触发时机**: 用户点击带 `data-track-click` 的元素
- **记录内容**: 元素 ID、名称、类型、点击时间
- **用途**: 追踪用户交互行为

### 4. 项目交互 (Project Interaction)
- **触发时机**: 用户点击项目卡片或查看项目详情
- **记录内容**: 项目 ID、项目名称、交互类型
- **用途**: **重点追踪 HR 对哪些项目感兴趣**

### 5. 滚动深度 (Scroll Depth)
- **触发时机**: 页面滚动达到阈值 (25%、50%、75%、90%)
- **记录内容**: 滚动深度百分比
- **用途**: 了解页面内容吸引力

### 6. 停留时长 (Time Spent)
- **触发时机**: 每 10 秒上报一次
- **记录内容**: 累计停留秒数
- **用途**: 衡量用户参与度

### 7. 文件下载 (File Download)
- **触发时机**: 用户下载简历等文件
- **记录内容**: 文件名、文件类型、下载时间
- **用途**: 追踪简历下载情况

### 8. 外部链接 (External Link)
- **触发时机**: 用户点击外部链接（如 Demo 链接）
- **记录内容**: URL、链接名称、类型
- **用途**: 追踪 HR 是否查看在线 Demo

## 配置说明

### analytics.js 配置项

```javascript
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
```

## 使用方法

### 1. 自动追踪

系统会自动追踪以下事件：
- 页面浏览
- 模块曝光（需添加 `data-track-section` 属性）
- 滚动深度
- 文件下载
- 外部链接点击

### 2. 手动追踪

```javascript
// 追踪项目交互
Analytics.trackProjectInteraction('project1', 'B2B 电商平台', 'view_detail');

// 追踪点击
Analytics.trackClick('download-btn', '下载简历', 'button');

// 追踪文件下载
Analytics.trackFileDownload('简历.pdf', 'pdf');

// 追踪外部链接
Analytics.trackExternalLink('https://crm.pmzwj.tech', '查看 CRM Demo', 'demo');
```

### 3. 添加追踪属性

**模块曝光追踪：**
```html
<section id="projects" data-track-section data-section-name="项目展示">
```

**项目卡片追踪：**
```html
<div class="project-card" 
     data-project-id="project1" 
     data-project-name="B2B 电商平台">
```

## 数据查看

### 本地查看

访问数据看板页面：
```
/works/analytics-dashboard.html
```

**功能：**
- 概览统计（会话数、PV、停留时长、点击数）
- 模块热度排行
- 项目兴趣度排行
- 详细事件记录
- 滚动深度分析

### 导出数据

在看板页面点击"导出数据"按钮，可导出 JSON 格式数据。

### 数据位置

数据存储在浏览器的 localStorage 中：
- **Key**: `portfolio_analytics`
- **格式**: JSON 数组

## 数据指标说明

### HR 兴趣度评估

**高兴趣信号：**
1. 在某个项目卡片停留时间长
2. 点击查看项目详情
3. 点击查看在线 Demo
4. 下载简历
5. 页面滚动深度超过 75%

**模块吸引力分析：**
- 模块曝光次数
- 模块停留时长
- 模块后的交互行为

### 项目兴趣度排行

系统会自动统计每个项目的交互次数，按兴趣度排序：
1. 项目卡片点击
2. 项目详情页浏览
3. 项目轮播图交互
4. 项目 Demo 查看

## 最佳实践

### 1. 保护隐私
- 不收集个人身份信息
- 仅统计行为数据
- 提供数据清除功能

### 2. 性能优化
- 使用防抖减少上报频率
- 使用 localStorage 避免网络请求
- beforeunload 时使用 sendBeacon 确保数据发送

### 3. 数据分析
- 定期导出数据分析
- 关注转化率（查看→下载简历）
- 优化低吸引力模块

## 常见问题

### Q: 数据存储在本地，如何汇总多用户数据？
A: 当前版本使用 localStorage 存储单用户数据。如需多用户汇总，需要：
1. 搭建后端 API 服务
2. 修改 `reportMethod` 为 `'api'`
3. 配置 `apiEndpoint` 为你的后端地址

### Q: 如何禁用埋点？
A: 修改配置 `enabled: false`

### Q: 如何查看实时日志？
A: 修改配置 `debug: true`，打开浏览器控制台查看

### Q: 数据会占用多少存储空间？
A: 每个事件约 500 字节，1000 个事件约 500KB。建议定期导出清理。

## 文件清单

```
js/analytics.js              - 埋点统计核心库
works/analytics-dashboard.html - 数据查看后台
works/analytics-guide.md     - 本文档
index.html                   - 已集成埋点的主页
```

## 下一步

1. **短期**: 使用 localStorage 版本，快速验证数据价值
2. **中期**: 搭建简易后端，实现数据汇总
3. **长期**: 接入专业分析平台（如 Google Analytics、神策数据）

---

*最后更新：2026-03-24*
