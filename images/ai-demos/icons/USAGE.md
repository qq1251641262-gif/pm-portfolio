# AI Demo Icons 使用指南

## 文件夹结构

```
images/
└── ai-demos/
    └── icons/
        ├── README.md           # 本说明文档
        ├── b2b-ecommerce.png   # B2B 电商图标（示例）
        ├── crm-fusion.png      # CRM 融合系统图标
        ├── bi-analytics.png    # BI 数据可视化图标
        ├── enterprise-crm.png  # 企业级 CRM 图标
        ├── new-retail.png      # 新零售电商图标
        └── corporate-website.png # 企业官网图标
```

## 在首页中使用

### 1. HTML 代码示例

在首页 AI Demo 区域添加图标：

```html
<!-- AI Demo 区域 -->
<section id="demo" class="py-16 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="section-title text-3xl font-bold mb-4">AI Demo</h2>
        <p style="color: var(--text-secondary);" class="mb-12">
            基于原型与文档，通过 AI 独立开发的可交互技术 Demo
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <!-- 项目 1 -->
            <div class="project-card">
                <div class="icon-wrapper">
                    <img src="images/ai-demos/icons/b2b-ecommerce.png" 
                         alt="B2B 电商" 
                         class="w-24 h-24 mx-auto">
                </div>
                <h3 class="text-lg font-semibold mt-4">B2B 电商</h3>
                <a href="demo-placeholder.html?id=1" class="text-primary hover:underline">
                    查看 AI Demo
                </a>
            </div>
            
            <!-- 项目 2 -->
            <div class="project-card">
                <div class="icon-wrapper">
                    <img src="images/ai-demos/icons/crm-fusion.png" 
                         alt="CRM 电商" 
                         class="w-24 h-24 mx-auto">
                </div>
                <h3 class="text-lg font-semibold mt-4">CRM 电商</h3>
                <a href="demo-placeholder.html?id=2" class="text-primary hover:underline">
                    查看 AI Demo
                </a>
            </div>
            
            <!-- 更多项目... -->
        </div>
    </div>
</section>
```

### 2. CSS 样式建议

```css
.project-card {
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6EA4D2 0%, #9BCCDD 100%);
    border-radius: 16px;
    padding: 16px;
}

.icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
```

## 图标设计规范

### 尺寸要求
- **推荐尺寸**: 120x120px 或更大
- **最小尺寸**: 64x64px
- **宽高比**: 1:1（正方形）
- **文件格式**: PNG（透明背景）或 SVG

### 设计风格
- 简洁、扁平化
- 避免过多细节
- 使用清晰的图形语言
- 保持视觉一致性

### 颜色建议
- 主色调：#6EA4D2（蓝色系）
- 辅助色：#9BCCDD（浅蓝）
- 背景：透明

## 项目图标对应关系

| 项目名称 | 图标文件名 | 说明 |
|---------|-----------|------|
| B2B 电商平台 | b2b-ecommerce.png | 购物车、商品、交易元素 |
| 电商 CRM 融合系统 | crm-fusion.png | CRM + 电商结合元素 |
| BI 数据可视化平台 | bi-analytics.png | 图表、数据、分析元素 |
| 企业级 CRM 系统 | enterprise-crm.png | 客户管理、关系网络元素 |
| 新零售电商 | new-retail.png | O2O、线上线下融合元素 |
| 企业品牌官网 | corporate-website.png | 企业建筑、品牌元素 |

## 添加新图标步骤

### 1. 准备图标文件
- 确保符合尺寸和格式要求
- 使用清晰的命名

### 2. 上传到正确位置
```
images/ai-demos/icons/your-icon-name.png
```

### 3. 更新首页 HTML
在 `index.html` 的 AI Demo 区域添加：

```html
<div class="project-card">
    <div class="icon-wrapper">
        <img src="images/ai-demos/icons/your-icon-name.png" 
             alt="项目名称" 
             class="w-24 h-24 mx-auto">
    </div>
    <h3 class="text-lg font-semibold mt-4">项目名称</h3>
    <a href="demo-placeholder.html?id=X" class="text-primary hover:underline">
        查看 AI Demo
    </a>
</div>
```

### 4. 更新本说明文档
在"项目图标对应关系"表格中添加新图标信息。

## 图标设计资源推荐

### 在线工具
- [Figma](https://figma.com) - 在线设计工具
- [Canva](https://canva.com) - 简易设计平台
- [IconScout](https://iconscout.com) - 图标资源库

### 图标库
- [Font Awesome](https://fontawesome.com) - 免费图标库
- [Feather Icons](https://feathericons.com) - 简洁图标集
- [Heroicons](https://heroicons.com) - Tailwind CSS 官方图标

### 设计指南
- 保持简洁
- 注意对比度
- 考虑可访问性
- 测试不同尺寸下的显示效果

## 优化建议

### 性能优化
1. **压缩图标**: 使用 TinyPNG 等工具压缩
2. **使用 WebP**: 现代浏览器支持，文件更小
3. **懒加载**: 视口外图标延迟加载

```html
<img src="images/ai-demos/icons/icon.png" 
     alt="图标说明" 
     loading="lazy">
```

### 响应式优化
```css
@media (max-width: 768px) {
    .icon-wrapper {
        width: 64px;
        height: 64px;
    }
    
    .icon-wrapper img {
        width: 48px;
        height: 48px;
    }
}
```

### 无障碍优化
```html
<!-- 添加适当的 alt 文本 -->
<img src="icon.png" alt="B2B 电商平台 - 在线交易管理系统">

<!-- 或者使用 aria-label -->
<div role="img" aria-label="B2B 电商平台图标">
    <img src="icon.png" alt="">
</div>
```

## 常见问题

### Q: 图标显示模糊？
A: 确保使用足够大的原始尺寸（至少 120x120px），避免拉伸小图。

### Q: 如何制作透明背景 PNG？
A: 使用 Photoshop、GIMP 或在线工具如 remove.bg 去除背景。

### Q: 图标颜色与主题不搭？
A: 使用设计工具调整颜色，或添加 CSS 滤镜：
```css
.icon-wrapper img {
    filter: hue-rotate(45deg) saturate(1.2);
}
```

### Q: 需要支持深色模式吗？
A: 当前设计以浅色背景为主，如需深色模式支持，可准备两套图标或使用 CSS 滤镜。

## 更新记录

### 2026-03-24
- ✨ 创建 AI Demo Icons 图片库
- 📁 建立文件夹结构
- 📝 编写使用文档

## 联系支持

如有问题，请联系开发团队或查看项目文档。
