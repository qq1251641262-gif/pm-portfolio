/**
 * 技能管理路由
 */

const express = require('express');
const router = express.Router();
const { query, queryOne, insert, update, remove } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取所有技能
router.get('/', async (req, res) => {
  try {
    const skills = await query('skills', { is_active: 1 });
    // 按排序顺序返回
    skills.sort((a, b) => a.sort_order - b.sort_order);
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个技能
router.get('/:id', async (req, res) => {
  try {
    const skill = await queryOne('skills', { id: parseInt(req.params.id) });
    if (!skill) {
      return res.status(404).json({ success: false, message: '技能不存在' });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建技能
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category, sort_order } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: '技能名称为必填项' });
    }
    
    const result = await insert('skills', {
      name,
      category: category || '',
      sort_order: sort_order || 0,
      is_active: 1
    });
    
    res.json({ success: true, message: '创建成功', data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新技能
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, category, sort_order, is_active } = req.body;
    const id = parseInt(req.params.id);
    
    const skill = await queryOne('skills', { id });
    if (!skill) {
      return res.status(404).json({ success: false, message: '技能不存在' });
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await update('skills', id, updateData);
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除技能
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const skill = await queryOne('skills', { id });
    if (!skill) {
      return res.status(404).json({ success: false, message: '技能不存在' });
    }
    
    await remove('skills', id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
