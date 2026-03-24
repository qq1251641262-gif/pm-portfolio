const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const demos = await query('SELECT * FROM ai_demos WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: demos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, image_url, demo_url, category, sort_order } = req.body;
    const result = await run(
      'INSERT INTO ai_demos (title, description, image_url, demo_url, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, demo_url, category, sort_order]
    );
    res.json({ success: true, data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, image_url, demo_url, category, sort_order, is_active } = req.body;
    await run(
      'UPDATE ai_demos SET title=?, description=?, image_url=?, demo_url=?, category=?, sort_order=?, is_active=? WHERE id=?',
      [title, description, image_url, demo_url, category, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM ai_demos WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
