/**
 * 文件上传路由
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 文件上传处理
router.post('/', verifyToken, async (req, res) => {
  try {
    // 检查是否有文件
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }

    const file = req.files.file;
    const type = req.body.type || 'general';
    
    // 验证文件类型
    const allowedTypes = {
      resume: ['.pdf', '.doc', '.docx'],
      image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      document: ['.pdf', '.doc', '.docx', '.txt'],
      general: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt']
    };
    
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExts = allowedTypes[type] || allowedTypes.general;
    
    if (!allowedExts.includes(fileExt)) {
      return res.status(400).json({ 
        success: false, 
        message: `不支持的文件类型，允许的类型: ${allowedExts.join(', ')}` 
      });
    }
    
    // 验证文件大小 (最大 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: '文件大小不能超过 10MB' 
      });
    }
    
    // 生成文件名: 类型_时间戳_原文件名
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${type}_${timestamp}_${safeName}`;
    const filepath = path.join(uploadsDir, filename);
    
    // 移动文件
    await file.mv(filepath);
    
    res.json({
      success: true,
      message: '上传成功',
      filename: filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      size: file.size
    });
    
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取上传的文件
router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    // 安全检查：确保文件路径在上传目录内
    const resolvedPath = path.resolve(filepath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).json({ success: false, message: '非法文件路径' });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ success: false, message: '文件不存在' });
    }
    
    res.sendFile(filepath);
    
  } catch (error) {
    console.error('获取文件失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
