/**
 * 内存数据存储 - 开发测试版本
 * 生产环境建议使用真实数据库
 */

const bcrypt = require('bcryptjs');

// 内存数据库
const memoryDB = {
  admins: [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('123456', 10),
      email: 'admin@pmzwj.tech',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  profile: [
    {
      id: 1,
      name: '张伟健',
      title: '产品经理',
      bio: '3年产品经验，B2B/C电商+数字化转型产品经理，独立负责门户迭代，主导从0到1搭建电商平台、CRM融合系统、BI数据可视化平台等核心产品，兼具乙方交付与甲方业务视角，精通全流程产品设计与跨团队协同落地',
      email: 'contact@pmzwj.tech',
      phone: '',
      location: '',
      avatar: '',
      resume_url: '张伟健-个人简历.pdf',
      social_links: JSON.stringify({
        github: '',
        linkedin: '',
        wechat: ''
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  skills: [
    { id: 1, name: '产品规划', category: '核心能力', level: 90, sort_order: 1, is_active: 1 },
    { id: 2, name: '需求分析', category: '核心能力', level: 85, sort_order: 2, is_active: 1 },
    { id: 3, name: '数据分析', category: '核心能力', level: 80, sort_order: 3, is_active: 1 },
    { id: 4, name: 'Axure RP', category: '工具', level: 90, sort_order: 4, is_active: 1 },
    { id: 5, name: 'Figma', category: '工具', level: 85, sort_order: 5, is_active: 1 },
    { id: 6, name: 'SQL', category: '技术', level: 75, sort_order: 6, is_active: 1 }
  ],
  experiences: [
    {
      id: 1,
      company: '某科技公司',
      position: '高级产品经理',
      start_date: '2023-01',
      end_date: '',
      is_current: 1,
      description: '负责B2B电商平台的产品规划和设计',
      achievements: '主导完成电商平台从0到1搭建',
      keywords: '电商平台,B2B,产品规划',
      sort_order: 1,
      is_active: 1
    },
    {
      id: 2,
      company: '某互联网公司',
      position: '产品经理',
      start_date: '2021-06',
      end_date: '2022-12',
      is_current: 0,
      description: '负责CRM系统的产品设计和优化',
      achievements: '提升客户转化率30%',
      keywords: 'CRM,数据分析,用户增长',
      sort_order: 2,
      is_active: 1
    }
  ],
  projects: [
    {
      id: 1,
      title: 'B2B电商平台',
      subtitle: '产品化方案',
      description: '从0到1搭建的B2B电商平台',
      category: '电商',
      tags: 'B2B,电商,SaaS',
      thumbnail: '',
      demo_url: 'https://retail.pmzwj.tech',
      github_url: '',
      sort_order: 1,
      is_featured: 1,
      is_active: 1
    },
    {
      id: 2,
      title: 'CRM融合系统',
      subtitle: '客户关系管理',
      description: '企业级CRM系统',
      category: 'CRM',
      tags: 'CRM,客户管理,销售',
      thumbnail: '',
      demo_url: 'https://crm.pmzwj.tech',
      github_url: '',
      sort_order: 2,
      is_featured: 1,
      is_active: 1
    }
  ],
  project_images: [],
  ai_demos: [
    {
      id: 1,
      title: 'AI智能客服',
      description: '基于大语言模型的智能客服系统',
      image_url: '',
      demo_url: '#',
      category: 'AI应用',
      sort_order: 1,
      is_active: 1
    }
  ],
  documents: [
    {
      id: 1,
      title: '产品需求文档模板',
      description: '标准PRD文档模板',
      file_url: '',
      file_type: 'pdf',
      category: '文档模板',
      sort_order: 1,
      is_active: 1
    }
  ],
  settings: {
    site_title: '张伟健 - 产品经理作品集',
    site_description: '个人作品展示网站',
    contact_email: 'contact@pmzwj.tech',
    analytics_enabled: 'false'
  },
  visitor_stats: []
};

// ID生成器
let idCounters = {
  admins: 1,
  profile: 1,
  skills: 6,
  experiences: 2,
  projects: 2,
  project_images: 0,
  ai_demos: 1,
  documents: 1,
  visitor_stats: 0
};

function generateId(table) {
  idCounters[table] = (idCounters[table] || 0) + 1;
  return idCounters[table];
}

// 查询所有
function query(table, conditions = {}) {
  let data = memoryDB[table] || [];
  
  // 如果是对象(如settings)，直接返回
  if (!Array.isArray(data)) {
    return data;
  }
  
  // 过滤条件
  if (Object.keys(conditions).length > 0) {
    data = data.filter(item => {
      for (const [key, value] of Object.entries(conditions)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }
  
  return data;
}

// 查询单个
function queryOne(table, conditions = {}) {
  const results = query(table, conditions);
  return Array.isArray(results) ? results[0] : results;
}

// 插入
function insert(table, data) {
  if (!memoryDB[table]) {
    memoryDB[table] = [];
  }
  
  const newItem = {
    id: generateId(table),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  memoryDB[table].push(newItem);
  return { id: newItem.id };
}

// 更新
function update(table, id, data) {
  if (!memoryDB[table] || !Array.isArray(memoryDB[table])) {
    return { changes: 0 };
  }
  
  const index = memoryDB[table].findIndex(item => item.id === id);
  if (index === -1) {
    return { changes: 0 };
  }
  
  memoryDB[table][index] = {
    ...memoryDB[table][index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  return { changes: 1 };
}

// 删除
function remove(table, id) {
  if (!memoryDB[table] || !Array.isArray(memoryDB[table])) {
    return { changes: 0 };
  }
  
  const index = memoryDB[table].findIndex(item => item.id === id);
  if (index === -1) {
    return { changes: 0 };
  }
  
  memoryDB[table].splice(index, 1);
  return { changes: 1 };
}

// 兼容旧接口
function run(sql, params = []) {
  // 解析SQL语句类型
  const sqlLower = sql.toLowerCase().trim();
  
  if (sqlLower.startsWith('insert')) {
    const table = sql.match(/into\s+(\w+)/i)?.[1];
    if (table) {
      const data = {};
      const keys = sql.match(/\(([^)]+)\)/)?.[1].split(',').map(k => k.trim());
      keys?.forEach((key, i) => {
        data[key] = params[i];
      });
      return insert(table, data);
    }
  } else if (sqlLower.startsWith('update')) {
    const table = sql.match(/update\s+(\w+)/i)?.[1];
    const id = params[params.length - 1];
    const data = {};
    // 简化处理，实际应该解析SET子句
    return update(table, id, data);
  } else if (sqlLower.startsWith('delete')) {
    const table = sql.match(/from\s+(\w+)/i)?.[1];
    const id = params[0];
    return remove(table, id);
  }
  
  return { changes: 0 };
}

// 导出兼容接口
module.exports = {
  query: (sql, params = []) => {
    // 解析表名
    const match = sql.match(/from\s+(\w+)/i);
    const table = match ? match[1].toLowerCase() : '';
    
    // 解析条件
    const conditions = {};
    const whereMatch = sql.match(/where\s+(.+)/i);
    if (whereMatch) {
      // 简化处理，支持 id = ? 格式
      const condMatch = whereMatch[1].match(/(\w+)\s*=\s*\?/);
      if (condMatch && params.length > 0) {
        conditions[condMatch[1]] = params[0];
      }
    }
    
    // 检查是否是查询单个
    if (sql.toLowerCase().includes('limit 1')) {
      const result = queryOne(table, conditions);
      return result ? [result] : [];
    }
    
    return query(table, conditions);
  },
  
  queryOne: (sql, params = []) => {
    const match = sql.match(/from\s+(\w+)/i);
    const table = match ? match[1].toLowerCase() : '';
    
    const conditions = {};
    const whereMatch = sql.match(/where\s+(.+)/i);
    if (whereMatch) {
      const condMatch = whereMatch[1].match(/(\w+)\s*=\s*\?/);
      if (condMatch && params.length > 0) {
        conditions[condMatch[1]] = params[0];
      }
    }
    
    return queryOne(table, conditions);
  },
  
  run: (sql, params = []) => {
    return run(sql, params);
  },
  
  // 直接操作接口
  memoryDB,
  insert,
  update,
  remove
};
