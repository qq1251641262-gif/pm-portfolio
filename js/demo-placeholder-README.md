# Demo预览缺省页面组件使用文档

## 概述

Demo预览缺省页面用于解决部分项目没有可用demo时的用户体验问题。当用户点击Demo链接时，系统会自动检测项目状态，如无可用demo则显示友好的"项目开发中"提示页面。

## 文件结构

```
works/
├── demo-placeholder.html      # 缺省页面（独立页面）
work1-6.html                   # 各项目详情页（已集成检测逻辑）
js/
├── demo-placeholder.js        # 可复用JavaScript组件
└── demo-placeholder-README.md # 本文档
```

## 功能特性

### 1. 自动检测机制
- 检测项目是否有有效的Demo链接
- 自动识别强制显示缺省页面的项目ID
- 支持URL参数传递项目信息

### 2. 强制显示规则
项目ID `1236` 被配置为始终显示缺省页面，无论是否有Demo链接。

### 3. 响应式设计
- 支持桌面端、平板、手机等多种设备
- 自适应布局和字体大小
- 流畅的动画过渡效果

### 4. 视觉设计
- 与系统整体UI风格一致
- 渐变背景和毛玻璃效果
- 动态进度条和浮动装饰元素

## 使用方法

### 方式一：独立页面跳转（已集成到项目页）

各项目详情页已自动集成检测逻辑，无需额外配置：

```javascript
// 点击Demo链接时自动检测
// 如果无Demo或项目ID在强制列表中，自动跳转到缺省页面
```

### 方式二：使用JavaScript组件

在页面中引入组件：

```html
<script src="../js/demo-placeholder.js"></script>
```

#### API方法

```javascript
// 1. 检查并重定向
DemoPlaceholder.checkAndRedirect('1236', 'https://demo.example.com');

// 2. 在新窗口打开Demo
DemoPlaceholder.openDemo('1236', 'https://demo.example.com', '_blank');

// 3. 获取处理后的Demo链接
const link = DemoPlaceholder.getDemoLink('1236', 'https://demo.example.com');

// 4. 渲染内联提示
DemoPlaceholder.renderInline(document.getElementById('container'), {
    title: '项目开发中',
    subtitle: 'Demo正在开发中',
    showProgress: true,
    showButtons: true
});

// 5. 动态添加强制显示项目
DemoPlaceholder.addForcePlaceholderId('1237');

// 6. 移除强制显示项目
DemoPlaceholder.removeForcePlaceholderId('1236');
```

### 方式三：直接访问缺省页面

```
works/demo-placeholder.html?id=1236&demo=https%3A%2F%2Fdemo.example.com
```

URL参数：
- `id`: 项目ID
- `demo`: Demo链接（URL编码）

## 配置说明

### 修改强制显示列表

编辑 `js/demo-placeholder.js`：

```javascript
// 强制显示缺省页面的项目ID列表
forcePlaceholderIds: ['1236'],
```

或在运行时动态修改：

```javascript
DemoPlaceholder.addForcePlaceholderId('新项目ID');
```

### 自定义缺省页面样式

编辑 `works/demo-placeholder.html` 中的CSS变量：

```css
:root {
    --color-primary: #6EA4D2;
    --color-secondary: #8B9DC5;
    --color-accent: #6BBCCF;
    --bg-warm: #F5F5F0;
    --text-primary: #2C3E50;
    --text-secondary: #5D6D7E;
}
```

## 测试验证

### 测试场景1：无Demo项目
1. 访问任意项目详情页
2. 将Demo链接设置为空或 `#`
3. 点击Demo链接
4. 验证是否显示缺省页面

### 测试场景2：项目1236强制显示
1. 直接访问 `works/demo-placeholder.html?id=1236`
2. 验证显示特定提示信息

### 测试场景3：响应式布局
1. 在Chrome DevTools中切换不同设备尺寸
2. 验证布局自适应效果
3. 检查文字大小和按钮间距

### 测试场景4：正常Demo项目
1. 确保项目有有效Demo链接
2. 点击Demo链接
3. 验证正常跳转到Demo页面

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 注意事项

1. 缺省页面使用Tailwind CSS CDN，需要网络连接
2. 项目ID为字符串类型，比较时注意类型转换
3. Demo链接需要进行URL编码
4. 强制显示列表在内存中维护，页面刷新后重置

## 更新日志

### v1.0.0 (2024-03-24)
- 初始版本发布
- 实现缺省页面独立组件
- 集成到所有项目详情页
- 添加项目1236强制显示规则
