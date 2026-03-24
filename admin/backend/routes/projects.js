const express = require('express');
const router = express.Router();
const { query, queryOne, insert, update, remove } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取所有项目（公开）
router.get('/', async (req, res) => {
  try {
    const projects = await query('projects', { is_active: 1 });
    // 按排序顺序返回
    projects.sort((a, b) => a.sort_order - b.sort_order);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个项目（公开）
router.get('/:id', async (req, res) => {
  try {
    const project = await queryOne('projects', { id: parseInt(req.params.id) });
    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加项目（需要认证）
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, overview, category, cover_image, project_url, github_url, sort_order } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: '项目标题为必填项' });
    }
    
    const result = await insert('projects', {
      title,
      subtitle: subtitle || '',
      overview: overview || '',
      category: category || '',
      cover_image: cover_image || '',
      project_url: project_url || '',
      github_url: github_url || '',
      sort_order: sort_order || 0,
      is_active: 1
    });
    
    res.json({ success: true, data: { id: result.id }, message: '项目添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新项目（需要认证）
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, subtitle, overview, category, cover_image, project_url, github_url, sort_order, is_active } = req.body;
    
    const project = await queryOne('projects', { id });
    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (overview !== undefined) updateData.overview = overview;
    if (category !== undefined) updateData.category = category;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (project_url !== undefined) updateData.project_url = project_url;
    if (github_url !== undefined) updateData.github_url = github_url;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await update('projects', id, updateData);
    res.json({ success: true, message: '项目更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除项目（需要认证）
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const project = await queryOne('projects', { id });
    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    
    await remove('projects', id);
    res.json({ success: true, message: '项目删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取项目图片（公开）
router.get('/:id/images', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const images = await query('project_images', { project_id: projectId, is_active: 1 });
    // 按排序顺序返回
    images.sort((a, b) => a.sort_order - b.sort_order);
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加项目图片（需要认证）
router.post('/:id/images', verifyToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { image_url, caption, sort_order } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ success: false, message: '图片URL为必填项' });
    }
    
    const result = await insert('project_images', {
      project_id: projectId,
      image_url,
      caption: caption || '',
      sort_order: sort_order || 0,
      is_active: 1
    });
    
    res.json({ success: true, data: { id: result.id }, message: '图片添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新项目图片（需要认证）
router.put('/:id/images/:imageId', verifyToken, async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const { image_url, caption, sort_order, is_active } = req.body;
    
    const image = await queryOne('project_images', { id: imageId });
    if (!image) {
      return res.status(404).json({ success: false, message: '图片不存在' });
    }
    
    const updateData = {};
    if (image_url !== undefined) updateData.image_url = image_url;
    if (caption !== undefined) updateData.caption = caption;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await update('project_images', imageId, updateData);
    res.json({ success: true, message: '图片更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除项目图片（需要认证）
router.delete('/:id/images/:imageId', verifyToken, async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId);
    
    const image = await queryOne('project_images', { id: imageId });
    if (!image) {
      return res.status(404).json({ success: false, message: '图片不存在' });
    }
    
    await remove('project_images', imageId);
    res.json({ success: true, message: '图片删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
