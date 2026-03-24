/**
 * 认证中间件
 */

const jwt = require('jsonwebtoken');
const { queryOne } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-admin-secret-key-2024';

// 验证JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未提供认证令牌'
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '认证令牌无效或已过期'
    });
  }
}

// 生成JWT token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// 验证管理员权限
async function requireAdmin(req, res, next) {
  try {
    const user = await queryOne(
      'SELECT role FROM admins WHERE id = ?',
      [req.userId]
    );
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '需要管理员权限'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '权限验证失败'
    });
  }
}

module.exports = {
  verifyToken,
  generateToken,
  requireAdmin,
  JWT_SECRET
};
