const express = require('express');
const router = express.Router();
const { query, queryOne, insert, update, remove } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取所有教育经历（公开）
router.get('/', async (req, res) => {
  try {
    const education = await query('education', { is_active: 1 });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个教育经历（公开）
router.get('/:id', async (req, res) => {
  try {
    const edu = await queryOne('education', { id: parseInt(req.params.id) });
    if (!edu) {
      return res.status(404).json({ success: false, message: '教育经历不存在' });
    }
    res.json({ success: true, data: edu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加教育经历（需要认证）
router.post('/', verifyToken, async (req, res) => {
  try {
    const { school, degree, major, start_date, end_date, is_current, description, achievements, sort_order } = req.body;
    
    if (!school || !degree) {
      return res.status(400).json({ success: false, message: '学校名称和学历为必填项' });
    }
    
    const result = await insert('education', {
      school,
      degree,
      major: major || '',
      start_date: start_date || '',
      end_date: end_date || '',
      is_current: is_current || 0,
      description: description || '',
      achievements: achievements || '',
      sort_order: sort_order || 0,
      is_active: 1
    });
    
    res.json({ success: true, data: { id: result.id }, message: '教育经历添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新教育经历（需要认证）
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { school, degree, major, start_date, end_date, is_current, description, achievements, sort_order, is_active } = req.body;
    const id = parseInt(req.params.id);
    
    const edu = await queryOne('education', { id });
    if (!edu) {
      return res.status(404).json({ success: false, message: '教育经历不存在' });
    }
    
    const updateData = {};
    if (school !== undefined) updateData.school = school;
    if (degree !== undefined) updateData.degree = degree;
    if (major !== undefined) updateData.major = major;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (is_current !== undefined) updateData.is_current = is_current;
    if (description !== undefined) updateData.description = description;
    if (achievements !== undefined) updateData.achievements = achievements;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await update('education', id, updateData);
    res.json({ success: true, message: '教育经历更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除教育经历（需要认证）
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const edu = await queryOne('education', { id });
    if (!edu) {
      return res.status(404).json({ success: false, message: '教育经历不存在' });
    }
    
    await remove('education', id);
    res.json({ success: true, message: '教育经历删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
