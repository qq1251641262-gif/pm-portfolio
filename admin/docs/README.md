# 个人网站后台管理系统

## 项目信息

- **项目名称**: designer-portfolio-admin
- **项目缩写**: dpa
- **创建时间**: 20260324
- **版本**: 1.0.0
- **管理员账号**: admin
- **管理员密码**: 123456

## 系统架构

### 技术栈

**后端:**
- Node.js + Express
- SQLite3 数据库
- JWT 认证
- bcryptjs 密码加密
- multer 文件上传

**前端:**
- HTML5 + CSS3
- Tailwind CSS
- Font Awesome 图标
- 原生 JavaScript

### 端口配置

- 后端 API: 8313
- 前端管理: 8314

## 项目结构

```
admin/
├── backend/              # 后端代码
│   ├── server.js         # 主服务器
│   ├── package.json      # 依赖配置
│   ├── routes/           # API路由
│   │   ├── auth.js       # 认证相关
│   │   ├── profile.js    # 个人资料
│   │   ├── skills.js     # 技能管理
│   │   ├── experiences.js# 工作经历
│   │   ├── projects.js   # 项目管理
│   │   ├── ai-demos.js   # AI Demo
│   │   ├── documents.js  # 文档管理
│   │   ├── settings.js   # 系统设置
│   │   ├── stats.js      # 访问统计
│   │   └── upload.js     # 文件上传
│   ├── middleware/       # 中间件
│   │   └── auth.js       # 认证中间件
│   ├── utils/            # 工具函数
│   │   └── db.js         # 数据库工具
│   ├── scripts/          # 脚本
│   │   └── init-db.js    # 数据库初始化
│   └── uploads/          # 上传文件目录
├── frontend/             # 前端代码
│   ├── login.html        # 登录页面
│   └── index.html        # 管理后台主页
└── docs/                 # 文档
    ├── README.md         # 项目说明
    ├── API.md            # API文档
    └── CHANGELOG.md      # 更新日志
```

## 数据库表结构

### 管理员表 (admins)
- id: 主键
- username: 用户名
- password: 密码(加密)
- email: 邮箱
- role: 角色
- created_at: 创建时间
- updated_at: 更新时间

### 个人资料表 (profile)
- id: 主键
- name: 姓名
- title: 职位
- bio: 简介
- email: 邮箱
- phone: 电话
- location: 位置
- avatar: 头像URL
- resume_url: 简历URL
- social_links: 社交链接(JSON)

### 技能表 (skills)
- id: 主键
- name: 技能名称
- category: 分类
- level: 熟练度
- sort_order: 排序
- is_active: 是否启用

### 工作经历表 (experiences)
- id: 主键
- company: 公司名称
- position: 职位
- start_date: 开始日期
- end_date: 结束日期
- is_current: 是否在职
- description: 描述
- achievements: 成就
- keywords: 关键词
- sort_order: 排序
- is_active: 是否启用

### 项目表 (projects)
- id: 主键
- title: 标题
- subtitle: 副标题
- description: 描述
- category: 分类
- tags: 标签
- thumbnail: 缩略图
- demo_url: 演示链接
- github_url: GitHub链接
- sort_order: 排序
- is_featured: 是否推荐
- is_active: 是否启用

### 项目图片表 (project_images)
- id: 主键
- project_id: 项目ID(外键)
- image_url: 图片URL
- caption: 说明
- sort_order: 排序

### AI Demo表 (ai_demos)
- id: 主键
- title: 标题
- description: 描述
- image_url: 图片URL
- demo_url: 演示链接
- category: 分类
- sort_order: 排序
- is_active: 是否启用

### 文档表 (documents)
- id: 主键
- title: 标题
- description: 描述
- file_url: 文件URL
- file_type: 文件类型
- category: 分类
- sort_order: 排序
- is_active: 是否启用

### 设置表 (settings)
- id: 主键
- key: 键
- value: 值
- description: 描述

### 访问统计表 (visitor_stats)
- id: 主键
- page_path: 页面路径
- ip_address: IP地址
- user_agent: 浏览器信息
- referrer: 来源
- visit_date: 访问日期
- visit_time: 访问时间

## 快速开始

### 1. 安装依赖

```bash
cd admin/backend
npm install
```

### 2. 初始化数据库

```bash
npm run init-db
```

### 3. 启动后端服务

```bash
npm start
# 或开发模式
npm run dev
```

### 4. 访问管理后台

打开浏览器访问: `http://localhost:8313`

或使用前端文件直接打开 `admin/frontend/login.html`

## API 接口

### 认证接口
- POST `/api/auth/login` - 登录
- GET `/api/auth/me` - 获取当前用户
- POST `/api/auth/change-password` - 修改密码

### 个人资料
- GET `/api/profile` - 获取资料
- PUT `/api/profile` - 更新资料

### 技能管理
- GET `/api/skills` - 获取所有技能
- POST `/api/skills` - 创建技能
- PUT `/api/skills/:id` - 更新技能
- DELETE `/api/skills/:id` - 删除技能

### 工作经历
- GET `/api/experiences` - 获取所有经历
- POST `/api/experiences` - 创建经历
- PUT `/api/experiences/:id` - 更新经历
- DELETE `/api/experiences/:id` - 删除经历

### 项目管理
- GET `/api/projects` - 获取所有项目
- GET `/api/projects/:id` - 获取项目详情
- POST `/api/projects` - 创建项目
- PUT `/api/projects/:id` - 更新项目
- DELETE `/api/projects/:id` - 删除项目

### AI Demo
- GET `/api/ai-demos` - 获取所有Demo
- POST `/api/ai-demos` - 创建Demo
- PUT `/api/ai-demos/:id` - 更新Demo
- DELETE `/api/ai-demos/:id` - 删除Demo

### 文档管理
- GET `/api/documents` - 获取所有文档
- POST `/api/documents` - 创建文档
- PUT `/api/documents/:id` - 更新文档
- DELETE `/api/documents/:id` - 删除文档

### 系统设置
- GET `/api/settings` - 获取所有设置
- PUT `/api/settings/:key` - 更新设置

### 访问统计
- POST `/api/stats/visit` - 记录访问
- GET `/api/stats` - 获取统计数据

### 文件上传
- POST `/api/upload/image` - 上传图片

## 安全说明

1. 所有修改操作需要 JWT 认证
2. 密码使用 bcryptjs 加密存储
3. API 限流: 15分钟内最多100次请求
4. 文件上传限制: 最大5MB, 仅允许图片和PDF

## 开发计划

### 第一阶段 (已完成)
- [x] 项目结构搭建
- [x] 数据库设计
- [x] 后端API基础框架
- [x] 登录认证
- [x] 管理后台界面

### 第二阶段 (待开发)
- [ ] 个人资料管理功能
- [ ] 技能管理功能
- [ ] 工作经历管理功能
- [ ] 项目管理功能
- [ ] AI Demo管理功能
- [ ] 文档管理功能

### 第三阶段 (待开发)
- [ ] 前台页面数据联动
- [ ] 访问统计图表
- [ ] 数据导入导出
- [ ] 富文本编辑器
- [ ] 图片裁剪功能

## 更新日志

### v1.0.0 (2026-03-24)
- 初始版本发布
- 完成基础架构搭建
- 实现用户认证系统
- 完成数据库设计
- 创建管理后台界面
