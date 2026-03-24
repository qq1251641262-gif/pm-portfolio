/**
 * 个人资料路由
 */

const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 获取个人资料
router.get('/', async (req, res) => {
  try {
    const profile = await queryOne('SELECT * FROM profile WHERE id = 1');
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新个人资料
router.put('/', verifyToken, async (req, res) => {
  try {
    const { name, title, bio, email, phone, location, avatar, resume_url, social_links } = req.body;
    
    await run(
      `UPDATE profile SET 
        name = ?, title = ?, bio = ?, email = ?, phone = ?, 
        location = ?, avatar = ?, resume_url = ?, social_links = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [name, title, bio, email, phone, location, avatar, resume_url, social_links]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
