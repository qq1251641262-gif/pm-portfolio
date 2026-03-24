const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const experiences = await query('SELECT * FROM experiences WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { company, position, start_date, end_date, is_current, description, achievements, keywords, sort_order } = req.body;
    const result = await run(
      'INSERT INTO experiences (company, position, start_date, end_date, is_current, description, achievements, keywords, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [company, position, start_date, end_date, is_current, description, achievements, keywords, sort_order]
    );
    res.json({ success: true, data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { company, position, start_date, end_date, is_current, description, achievements, keywords, sort_order, is_active } = req.body;
    await run(
      'UPDATE experiences SET company=?, position=?, start_date=?, end_date=?, is_current=?, description=?, achievements=?, keywords=?, sort_order=?, is_active=? WHERE id=?',
      [company, position, start_date, end_date, is_current, description, achievements, keywords, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM experiences WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
