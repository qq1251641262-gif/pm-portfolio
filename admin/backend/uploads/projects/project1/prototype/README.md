# 项目1 - B2B电商平台原型图片

## 图片存放位置

```
admin/backend/uploads/projects/project1/prototype/
├── product-center.jpg      # 产品中心 - 展示化工产品分类与搜索功能
├── trading-center.jpg      # 交易中心 - 竞价交易与订单管理界面
├── flash-sale.jpg          # 闪购专区 - 限时抢购活动页面
├── shopping-cart.jpg       # 购物车 - 多供应商结算与价格计算
├── seller-center.jpg       # 卖家中心 - 商品发布与活动管理后台
└── README.md               # 本说明文件
```

## 图片说明

| 文件名 | 描述 | 尺寸建议 |
|--------|------|----------|
| product-center.jpg | 产品中心页面，展示化工产品分类、搜索功能、产品列表 | 1200x800px |
| trading-center.jpg | 交易中心页面，展示竞价交易、订单管理、交易列表 | 1200x800px |
| flash-sale.jpg | 闪购专区页面，展示限时抢购活动、商品详情 | 1200x800px |
| shopping-cart.jpg | 购物车页面，展示多供应商商品、结算功能 | 1200x800px |
| seller-center.jpg | 卖家中心后台，展示商品发布、活动管理 | 1200x800px |

## 数据库记录

图片数据已预置在内存数据库中，路径为：
- `/uploads/projects/project1/prototype/xxx.jpg`

## 前台展示

图片将在项目1详情页(work1.html)的"原型设计"部分展示，通过API动态加载。

## 上传方式

1. 将图片文件直接复制到本文件夹
2. 确保文件名与上述列表一致
3. 重启后端服务以加载新图片
4. 刷新前台页面查看效果

## API接口

- **获取图片列表**: `GET /api/projects/1/images`
- **添加图片**: `POST /api/projects/1/images` (需要认证)
- **更新图片**: `PUT /api/projects/1/images/:id` (需要认证)
- **删除图片**: `DELETE /api/projects/1/images/:id` (需要认证)
