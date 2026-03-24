const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    const images = await query('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order', [req.params.id]);
    res.json({ success: true, data: { ...project, images } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, description, category, tags, thumbnail, demo_url, github_url, sort_order } = req.body;
    const result = await run(
      'INSERT INTO projects (title, subtitle, description, category, tags, thumbnail, demo_url, github_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, description, category, tags, thumbnail, demo_url, github_url, sort_order]
    );
    res.json({ success: true, data: { id: result.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, description, category, tags, thumbnail, demo_url, github_url, sort_order, is_active } = req.body;
    await run(
      'UPDATE projects SET title=?, subtitle=?, description=?, category=?, tags=?, thumbnail=?, demo_url=?, github_url=?, sort_order=?, is_active=? WHERE id=?',
      [title, subtitle, description, category, tags, thumbnail, demo_url, github_url, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
