/**
 * 数据库初始化脚本
 * 创建所有必要的表和初始数据
 */

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../database/portfolio.db');

// 创建数据库连接
const db = new Database(DB_PATH);
console.log('数据库连接成功');

// 启用外键约束
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// 创建表的 SQL 语句
const createTables = [
  // 管理员表
  `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 个人资料表
  `CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    avatar TEXT,
    resume_url TEXT,
    social_links TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 技能表
  `CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    level INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 工作经历表
  `CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    is_current INTEGER DEFAULT 0,
    description TEXT,
    achievements TEXT,
    keywords TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 项目表
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT,
    tags TEXT,
    thumbnail TEXT,
    demo_url TEXT,
    github_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 项目图片表
  `CREATE TABLE IF NOT EXISTS project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`,

  // AI Demo 表
  `CREATE TABLE IF NOT EXISTS ai_demos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    demo_url TEXT,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 文档展示表
  `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_type TEXT,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 网站配置表
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 访问统计表
  `CREATE TABLE IF NOT EXISTS visitor_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    visit_date DATE DEFAULT (date('now')),
    visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

// 创建索引
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category)',
  'CREATE INDEX IF NOT EXISTS idx_experiences_sort ON experiences(sort_order)',
  'CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)',
  'CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured)',
  'CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id)',
  'CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(visit_date)'
];

// 执行初始化
try {
  console.log('开始创建数据表...');
  
  // 创建表
  for (const sql of createTables) {
    db.exec(sql);
  }
  console.log('✓ 数据表创建完成');

  // 创建索引
  console.log('开始创建索引...');
  for (const sql of createIndexes) {
    db.exec(sql);
  }
  console.log('✓ 索引创建完成');

  // 初始化管理员账号
  console.log('开始初始化数据...');
  const hashedPassword = bcrypt.hashSync('123456', 10);
  
  const insertAdmin = db.prepare(
    'INSERT OR IGNORE INTO admins (username, password, email, role) VALUES (?, ?, ?, ?)'
  );
  insertAdmin.run('admin', hashedPassword, 'admin@pmzwj.tech', 'admin');
  console.log('✓ 管理员账号创建完成');
  
  // 初始化个人资料
  const insertProfile = db.prepare(
    'INSERT OR IGNORE INTO profile (id, name, title, bio, email) VALUES (1, ?, ?, ?, ?)'
  );
  insertProfile.run('张伟健', '产品经理', '3年产品经验，B2B/C电商+数字化转型产品经理', 'contact@pmzwj.tech');
  console.log('✓ 个人资料初始化完成');
  
  // 初始化默认设置
  const defaultSettings = [
    ['site_title', '张伟健 - 产品经理作品集', '网站标题'],
    ['site_description', '个人作品展示网站', '网站描述'],
    ['contact_email', 'contact@pmzwj.tech', '联系邮箱'],
    ['analytics_enabled', 'false', '是否启用统计']
  ];
  
  const insertSetting = db.prepare(
    'INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)'
  );
  
  for (const [key, value, desc] of defaultSettings) {
    insertSetting.run(key, value, desc);
  }
  console.log('✓ 默认设置初始化完成');

  console.log('\n========================================');
  console.log('数据库初始化成功！');
  console.log('========================================');
  console.log('默认管理员账号: admin');
  console.log('默认管理员密码: 123456');
  console.log('========================================');
  
} catch (error) {
  console.error('初始化失败:', error);
  process.exit(1);
} finally {
  db.close();
}
