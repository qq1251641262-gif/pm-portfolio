/**
 * 数据库连接工具
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/portfolio.db');

// 创建数据库连接
function getConnection() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('数据库连接失败:', err);
    }
  });
}

// 执行查询（返回所有结果）
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getConnection();
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// 执行查询（返回单个结果）
function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getConnection();
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// 执行插入、更新、删除
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getConnection();
    db.run(sql, params, function(err) {
      db.close();
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// 执行事务
async function transaction(callback) {
  const db = getConnection();
  
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', async (err) => {
      if (err) {
        db.close();
        reject(err);
        return;
      }
      
      try {
        const result = await callback(db);
        db.run('COMMIT', (err) => {
          db.close();
          if (err) reject(err);
          else resolve(result);
        });
      } catch (error) {
        db.run('ROLLBACK', () => {
          db.close();
          reject(error);
        });
      }
    });
  });
}

module.exports = {
  getConnection,
  query,
  queryOne,
  run,
  transaction
};
