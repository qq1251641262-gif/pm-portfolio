/**
 * 技能管理路由
 */

const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取所有技能
router.get('/', async (req, res) => {
  try {
    const skills = await query(
      'SELECT * FROM skills WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个技能
router.get('/:id', async (req, res) => {
  try {
    const skill = await queryOne('SELECT * FROM skills WHERE id = ?', [req.params.id]);
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
    const { name, category, level, sort_order } = req.body;
    const result = await run(
      'INSERT INTO skills (name, category, level, sort_order) VALUES (?, ?, ?, ?)',
      [name, category, level, sort_order || 0]
    );
    res.json({ success: true, message: '创建成功', data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新技能
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, category, level, sort_order, is_active } = req.body;
    await run(
      `UPDATE skills SET 
        name = ?, category = ?, level = ?, sort_order = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [name, category, level, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除技能
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
