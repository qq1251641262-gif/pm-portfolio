# 静态数据文件夹

## 说明

本文件夹存放网站前台展示所需的静态 JSON 数据文件。这些数据通过 GitHub 同步到 Netlify，实现前台页面的数据展示。

## 文件说明

| 文件名 | 说明 | 数据内容 |
|--------|------|----------|
| `profile.json` | 个人资料 | 姓名、职位、简介、联系方式等 |
| `skills.json` | 技能列表 | 技能名称、分类、排序等 |
| `experiences.json` | 工作经历 | 公司、职位、时间、描述、成就等 |
| `education.json` | 教育经历 | 学校、学历、专业、时间等 |
| `projects.json` | 项目列表 | 项目名称、描述、标签、链接、图片等 |
| `ai-demos.json` | AI Demo列表 | Demo标题、描述、图标、链接等 |
| `settings.json` | 网站设置 | 网站标题、描述、联系邮箱等 |

## 使用方法

### 1. 前台页面加载数据

前台页面通过 `js/data-loader.js` 加载这些数据：

```javascript
// 加载项目列表
const projects = await DataLoader.loadProjects();

// 加载个人资料
const profile = await DataLoader.loadProfile();

// 加载技能列表
const skills = await DataLoader.loadSkills();
```

### 2. 更新数据

直接编辑对应的 JSON 文件，修改完成后提交到 GitHub：

```bash
git add data/
git commit -m "更新项目数据"
git push origin main
```

Netlify 会自动部署更新后的内容。

### 3. 添加项目图片

项目图片存放在 `images/projects/project{ID}/prototype/` 目录下：

```
images/
└── projects/
    └── project1/
        └── prototype/
            ├── product-center.jpg
            ├── trading-center.jpg
            └── ...
```

在 `projects.json` 中配置图片路径：

```json
{
  "id": 1,
  "title": "项目名称",
  "images": [
    {
      "id": 1,
      "image_url": "images/projects/project1/prototype/product-center.jpg",
      "caption": "图片说明",
      "sort_order": 1
    }
  ]
}
```

## 数据格式规范

### profile.json
```json
{
  "id": 1,
  "name": "姓名",
  "title": "职位",
  "bio": "个人简介",
  "email": "邮箱",
  "phone": "电话",
  "location": "所在地",
  "avatar": "头像URL",
  "resume_url": "简历文件URL",
  "social_links": {
    "github": "",
    "linkedin": "",
    "wechat": ""
  }
}
```

### projects.json
```json
[
  {
    "id": 1,
    "title": "项目名称",
    "subtitle": "项目副标题",
    "description": "项目描述",
    "category": "分类",
    "tags": ["标签1", "标签2"],
    "thumbnail": "缩略图URL",
    "demo_url": "Demo链接",
    "detail_url": "详情页链接",
    "sort_order": 1,
    "is_featured": 1,
    "is_active": 1,
    "images": [
      {
        "id": 1,
        "image_url": "图片路径",
        "caption": "图片说明",
        "sort_order": 1
      }
    ]
  }
]
```

## 注意事项

1. **JSON 格式**：确保所有 JSON 文件格式正确，可使用在线工具验证
2. **图片路径**：使用相对路径，从网站根目录开始
3. **字符编码**：文件使用 UTF-8 编码
4. **数据同步**：修改后需要提交到 GitHub 才能生效
5. **缓存问题**：Netlify 部署后可能需要清除浏览器缓存查看更新

## 与后台管理系统的区别

| 特性 | 静态数据 (本文件夹) | 后台管理系统 |
|------|---------------------|--------------|
| 部署位置 | Netlify (与前台一起) | 独立服务器 |
| 数据更新 | 编辑 JSON 文件 | 通过 Web 界面 |
| 实时性 | 部署后生效 | 即时生效 |
| 适用场景 | 展示型数据 | 动态管理数据 |
| 联动方式 | GitHub 同步 | API 接口 |

当前采用静态数据方案是因为后台管理系统尚未部署到生产环境。后续后台部署后，可选择：
1. 继续使用静态数据（简单稳定）
2. 切换到 API 动态加载（实时更新）
3. 构建时预渲染（最佳性能）
