/**
 * 个人网站后台管理系统 - 主服务器
 * 端口: 8313
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8313;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false
}));

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', limiter);

// CORS配置 - 允许所有来源(开发环境)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 文件上传中间件
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  abortOnLimit: true,
  responseOnLimit: '文件大小不能超过 10MB'
}));

// 解析JSON和URL编码数据
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '../frontend')));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/skill-categories', require('./routes/skill-categories'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/education', require('./routes/education'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/ai-demos', require('./routes/ai-demos'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/upload', require('./routes/upload'));

// 根路径 - 返回服务信息
app.get('/', (req, res) => {
  res.json({
    message: '个人网站后台管理系统 API 服务',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profile: '/api/profile',
      skills: '/api/skills',
      experiences: '/api/experiences',
      projects: '/api/projects',
      aiDemos: '/api/ai-demos',
      documents: '/api/documents',
      settings: '/api/settings',
      stats: '/api/stats',
      upload: '/api/upload'
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'portfolio-admin-backend',
    version: '1.0.0'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('个人网站后台管理系统');
  console.log('='.repeat(50));
  console.log(`服务器运行在: http://localhost:${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

module.exports = app;
