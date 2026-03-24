const express = require('express');
const router = express.Router();
const { query, queryOne, run, insert, memoryDB } = require('../utils/db');
const { verifyToken } = require('../middleware/auth');

// 记录访问
router.post('/visit', async (req, res) => {
  try {
    const { page_path } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer;
    
    await insert('visitor_stats', {
      page_path,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
      visit_date: new Date().toISOString().split('T')[0]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取统计数据（需要认证）
router.get('/', verifyToken, async (req, res) => {
  try {
    const stats = memoryDB.visitor_stats || [];
    
    // 总访问量
    const total = stats.length;
    
    // 今日访问量
    const today = new Date().toISOString().split('T')[0];
    const todayCount = stats.filter(s => s.visit_date === today).length;
    
    // 页面统计
    const pageCounts = {};
    stats.forEach(s => {
      pageCounts[s.page_path] = (pageCounts[s.page_path] || 0) + 1;
    });
    
    const pages = Object.entries(pageCounts)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
