const express = require('express');
const router = express.Router();
const { query, queryOne, insert, update, remove } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取所有技能分类（公开）
router.get('/', async (req, res) => {
  try {
    const categories = await query('skill_categories', { is_active: 1 });
    // 按排序顺序返回
    categories.sort((a, b) => a.sort_order - b.sort_order);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个技能分类（公开）
router.get('/:id', async (req, res) => {
  try {
    const category = await queryOne('skill_categories', { id: parseInt(req.params.id) });
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取分类下的所有技能（公开）
router.get('/:id/skills', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await queryOne('skill_categories', { id: categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    const skills = await query('skills', { category: category.name, is_active: 1 });
    skills.sort((a, b) => a.sort_order - b.sort_order);
    
    res.json({ 
      success: true, 
      data: {
        category,
        skills
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加技能分类（需要认证）
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, sort_order } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: '分类名称为必填项' });
    }
    
    // 检查分类名称是否已存在
    const existing = await queryOne('skill_categories', { name });
    if (existing) {
      return res.status(400).json({ success: false, message: '分类名称已存在' });
    }
    
    const result = await insert('skill_categories', {
      name,
      description: description || '',
      sort_order: sort_order || 0,
      is_active: 1
    });
    
    res.json({ success: true, data: { id: result.id }, message: '分类添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新技能分类（需要认证）
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, sort_order, is_active } = req.body;
    const id = parseInt(req.params.id);
    
    const category = await queryOne('skill_categories', { id });
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    // 如果修改了名称，检查是否与其他分类重复
    if (name && name !== category.name) {
      const existing = await queryOne('skill_categories', { name });
      if (existing && existing.id !== id) {
        return res.status(400).json({ success: false, message: '分类名称已存在' });
      }
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await update('skill_categories', id, updateData);
    res.json({ success: true, message: '分类更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除技能分类（需要认证）
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const category = await queryOne('skill_categories', { id });
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    // 检查该分类下是否有技能
    const skills = await query('skills', { category: category.name });
    if (skills.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `该分类下还有 ${skills.length} 个技能，请先删除或转移这些技能` 
      });
    }
    
    await remove('skill_categories', id);
    res.json({ success: true, message: '分类删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
