# 分销商城系统

一个基于 Node.js + Express + MySQL 的分销商城系统，包含完整的用户注册登录、商品管理、订单管理和分销佣金功能。

## 功能特性

### 用户模块
- 用户注册/登录（JWT认证）
- 推荐人机制（支持通过推荐链接注册）
- 个人资料管理
- bcrypt密码加密

### 商品模块
- 商品列表展示（分页、分类、搜索、排序）
- 商品详情页
- 商品分类管理
- 库存管理

### 订单模块
- 创建订单
- 订单列表
- 订单详情
- 订单支付（模拟）
- 取消订单

### 分销模块
- 二级分销体系（一级100%，二级50%）
- 佣金自动计算与结算
- 我的团队（一级/二级团队成员）
- 佣金明细
- 提现管理
- 推广链接生成

## 技术栈

- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: JWT + bcryptjs
- **前端**: 原生 HTML/CSS/JavaScript
- **其他**: mysql2连接池、dotenv环境配置、cors跨域

## 项目结构

```
distribution-mall/
├── app.js                    # 项目入口
├── package.json              # 项目配置
├── .env                      # 环境变量配置
├── sql/
│   └── init.sql              # 数据库初始化脚本
├── scripts/
│   └── initDB.js             # 数据库初始化工具
├── config/
│   └── db.js                 # 数据库配置
├── middleware/
│   └── auth.js               # JWT认证中间件
├── utils/
│   ├── jwt.js                # JWT工具函数
│   └── response.js           # 响应封装
├── controllers/
│   ├── userController.js     # 用户控制器
│   ├── productController.js  # 商品控制器
│   ├── orderController.js    # 订单控制器
│   └── distributionController.js # 分销控制器
├── routes/
│   ├── userRoutes.js         # 用户路由
│   ├── productRoutes.js      # 商品路由
│   ├── orderRoutes.js        # 订单路由
│   └── distributionRoutes.js # 分销路由
└── public/                   # 前端静态文件
    ├── index.html            # 商城首页
    ├── login.html            # 登录/注册页
    ├── product.html          # 商品详情页
    ├── user.html             # 个人中心
    ├── css/
    │   └── style.css         # 样式文件
    └── js/
        └── common.js         # 公共JS
```

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

修改 `.env` 文件中的数据库配置：

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=distribution_mall
JWT_SECRET=distribution_mall_secret_key_2024
JWT_EXPIRES_IN=7d
```

### 3. 初始化数据库

方式一：使用 Node.js 脚本

```bash
npm run init-db
```

方式二：手动执行 SQL 文件

```bash
mysql -u root -p < sql/init.sql
```

### 4. 启动服务

```bash
npm start
```

启动成功后访问：
- 商城首页: http://localhost:3000/index.html
- 登录/注册: http://localhost:3000/login.html

## API 接口文档

### 用户接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/user/register | 用户注册 | 否 |
| POST | /api/user/login | 用户登录 | 否 |
| GET | /api/user/info | 获取用户信息 | 是 |
| PUT | /api/user/info | 更新用户信息 | 是 |

### 商品接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/product/list | 商品列表 | 否 |
| GET | /api/product/detail/:id | 商品详情 | 否 |
| GET | /api/product/categories | 分类列表 | 否 |

### 订单接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/order/create | 创建订单 | 是 |
| GET | /api/order/list | 订单列表 | 是 |
| GET | /api/order/detail/:id | 订单详情 | 是 |
| POST | /api/order/pay/:id | 支付订单 | 是 |
| POST | /api/order/cancel/:id | 取消订单 | 是 |

### 分销接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/distribution/team | 我的团队 | 是 |
| GET | /api/distribution/commissions | 佣金明细 | 是 |
| GET | /api/distribution/commission-stats | 佣金统计 | 是 |
| GET | /api/distribution/parent | 推荐人信息 | 是 |
| POST | /api/distribution/withdraw | 申请提现 | 是 |
| GET | /api/distribution/withdraws | 提现记录 | 是 |

## 分销规则

- **一级分销**: 直接推荐的好友下单，获得商品佣金比例的100%
- **二级分销**: 好友推荐的好友下单，获得商品佣金比例的50%
- 佣金在订单支付成功后自动结算到可用余额
- 支持提现申请

## 数据库表结构

1. **users** - 用户表
2. **products** - 商品表
3. **categories** - 商品分类表
4. **orders** - 订单表
5. **order_items** - 订单商品表
6. **commissions** - 佣金记录表
7. **withdrawals** - 提现记录表

## 说明

- 本项目为演示用途，支付功能为模拟实现
- 生产环境请务必修改 JWT_SECRET 和数据库密码
- 建议使用 HTTPS 协议部署
