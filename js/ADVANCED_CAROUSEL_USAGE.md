# 高级轮播图组件使用文档

## 概述

AdvancedCarousel 是一个功能强大的组合式轮播图组件，采用左侧主图展示区 + 右侧缩略图导航区的布局设计。

## 功能特性

### 核心功能
- ✅ 左侧主图区域（占 70%）+ 右侧缩略图区域（占 30%）
- ✅ 点击缩略图平滑切换主图
- ✅ 左右箭头按钮切换
- ✅ 触摸滑动支持（移动端）
- ✅ 自动轮播（可配置）
- ✅ 图片懒加载
- ✅ 加载状态显示
- ✅ 错误处理机制
- ✅ 响应式设计

### 交互特性
- 缩略图垂直排列，支持滚动
- 当前选中项高亮显示（蓝色边框 + 阴影）
- 鼠标悬停暂停自动轮播
- 键盘导航支持（Enter/Space 切换）
- 触摸手势支持

### 响应式布局
- **桌面端**：左右布局（主图 70% + 缩略图 30%）
- **移动端**：上下布局（主图在上，缩略图水平滚动在下）

## 使用方法

### 1. 引入组件

在 HTML 的 `<head>` 标签中引入：

```html
<script src="js/advanced-carousel.js"></script>
```

### 2. HTML 结构

创建一个容器元素：

```html
<div id="my-carousel" class="carousel-container"></div>
```

### 3. 初始化组件

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const carouselImages = [
        {
            src: 'path/to/image1.jpg',
            alt: '图片 1 说明',
            title: '图片 1 标题',
            description: '图片 1 描述文字'
        },
        {
            src: 'path/to/image2.jpg',
            alt: '图片 2 说明',
            title: '图片 2 标题',
            description: '图片 2 描述文字'
        }
        // 更多图片...
    ];
    
    new AdvancedCarousel('#my-carousel', {
        images: carouselImages,
        autoPlay: true,
        autoPlayInterval: 5000,
        transitionDuration: 500,
        thumbnailsVisible: 4
    });
});
```

## 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| images | Array | [] | 图片数组，每项包含 src、alt、title、description |
| autoPlay | Boolean | true | 是否启用自动轮播 |
| autoPlayInterval | Number | 5000 | 自动轮播间隔（毫秒） |
| transitionDuration | Number | 500 | 切换动画时长（毫秒） |
| thumbnailsVisible | Number | 4 | 同时显示的缩略图数量参考值 |

### 图片对象结构

```javascript
{
    src: '图片路径',          // 必填
    alt: '替代文本',          // 可选
    title: '标题',            // 可选，显示在主图下方
    description: '描述文字'    // 可选，显示在标题下方
}
```

## 公开方法

### play()
启动自动轮播

```javascript
const carousel = new AdvancedCarousel('#my-carousel', options);
carousel.play();
```

### pause()
暂停自动轮播

```javascript
carousel.pause();
```

### goToSlide(index)
跳转到指定幻灯片

```javascript
carousel.goToSlide(2); // 跳转到第 3 张
```

### prev()
切换到上一张

```javascript
carousel.prev();
```

### next()
切换到下一张

```javascript
carousel.next();
```

### refresh()
刷新轮播组件（重新渲染）

```javascript
carousel.refresh();
```

### destroy()
销毁轮播组件

```javascript
carousel.destroy();
```

## 事件监听

组件会触发 `carouselChange` 自定义事件：

```javascript
document.querySelector('#my-carousel').addEventListener('carouselChange', function(e) {
    console.log('当前索引:', e.detail.index);
    console.log('当前图片:', e.detail.item);
});
```

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>轮播图示例</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="js/advanced-carousel.js"></script>
</head>
<body>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">项目图片展示</h1>
        <div id="project-carousel" class="carousel-container"></div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const images = [
                {
                    src: 'images/project1.jpg',
                    alt: '项目 1',
                    title: '项目概览',
                    description: '项目整体效果展示'
                },
                {
                    src: 'images/project2.jpg',
                    alt: '项目 2',
                    title: '功能模块',
                    description: '核心功能展示'
                },
                {
                    src: 'images/project3.jpg',
                    alt: '项目 3',
                    title: '界面设计',
                    description: 'UI/UX设计展示'
                }
            ];
            
            new AdvancedCarousel('#project-carousel', {
                images: images,
                autoPlay: true,
                autoPlayInterval: 5000,
                transitionDuration: 500
            });
        });
    </script>
</body>
</html>
```

## 样式定制

组件会自动注入所需样式，如需自定义可通过 CSS 覆盖：

```css
/* 自定义主图区域大小 */
.carousel-main {
    flex: 0 0 65%; /* 改为 65% */
}

/* 自定义缩略图区域大小 */
.carousel-thumbnails {
    flex: 0 0 35%; /* 改为 35% */
}

/* 自定义高亮颜色 */
.thumbnail-item.active {
    border-color: #your-color;
    box-shadow: 0 4px 12px rgba(your-r, your-g, your-b, 0.4);
}

/* 自定义移动端断点 */
@media (max-width: 1024px) {
    .carousel-wrapper {
        flex-direction: column;
    }
}
```

## 浏览器兼容性

- Chrome/Edge: ✅ (最新版本)
- Firefox: ✅ (最新版本)
- Safari: ✅ (最新版本)
- 移动端浏览器: ✅ (iOS Safari, Chrome Mobile)

## 性能优化建议

1. **图片优化**
   - 使用适当的图片格式（WebP > PNG > JPG）
   - 压缩图片大小
   - 使用响应式图片

2. **懒加载**
   - 首张图片使用 `loading="eager"`
   - 其他图片使用 `loading="lazy"`

3. **图片数量**
   - 建议不超过 20 张
   - 过多图片会影响初始加载性能

## 常见问题

### Q: 如何动态添加图片？
```javascript
carousel.config.images.push(newImage);
carousel.refresh();
```

### Q: 如何禁用自动轮播？
```javascript
new AdvancedCarousel('#carousel', {
    autoPlay: false
});
```

### Q: 移动端缩略图不滚动？
确保容器有足够的空间，检查是否有 CSS 冲突。

## 更新日志

### v1.0.0 (2026-03-24)
- ✨ 初始版本发布
- ✅ 实现基础轮播功能
- ✅ 实现缩略图导航
- ✅ 实现响应式布局
- ✅ 实现图片懒加载
- ✅ 实现触摸手势支持

## 技术支持

如有问题或建议，请联系开发团队。
