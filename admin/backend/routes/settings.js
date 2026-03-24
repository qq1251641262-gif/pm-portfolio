const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const settings = await query('SELECT * FROM settings');
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:key', verifyToken, async (req, res) => {
  try {
    const { value } = req.body;
    await run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP',
      [req.params.key, value, value]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
