const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const docs = await query('SELECT * FROM documents WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, file_url, file_type, category, sort_order } = req.body;
    const result = await run(
      'INSERT INTO documents (title, description, file_url, file_type, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, file_url, file_type, category, sort_order]
    );
    res.json({ success: true, data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, file_url, file_type, category, sort_order, is_active } = req.body;
    await run(
      'UPDATE documents SET title=?, description=?, file_url=?, file_type=?, category=?, sort_order=?, is_active=? WHERE id=?',
      [title, description, file_url, file_type, category, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM documents WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
