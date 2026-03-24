const express = require('express');
const router = express.Router();
const { query, run } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 记录访问
router.post('/visit', async (req, res) => {
  try {
    const { page_path } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer;
    
    await run(
      'INSERT INTO visitor_stats (page_path, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)',
      [page_path, ip, userAgent, referrer]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取统计数据（需要认证）
router.get('/', verifyToken, async (req, res) => {
  try {
    const totalVisits = await queryOne('SELECT COUNT(*) as count FROM visitor_stats');
    const todayVisits = await queryOne(
      'SELECT COUNT(*) as count FROM visitor_stats WHERE visit_date = DATE("now")'
    );
    const pageStats = await query(
      'SELECT page_path, COUNT(*) as count FROM visitor_stats GROUP BY page_path ORDER BY count DESC LIMIT 10'
    );
    
    res.json({
      success: true,
      data: {
        total: totalVisits.count,
        today: todayVisits.count,
        pages: pageStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
