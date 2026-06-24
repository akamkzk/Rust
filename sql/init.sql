CREATE DATABASE IF NOT EXISTS distribution_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE distribution_mall;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  nickname VARCHAR(50) DEFAULT '' COMMENT '昵称',
  phone VARCHAR(20) DEFAULT '' COMMENT '手机号',
  avatar VARCHAR(255) DEFAULT '' COMMENT '头像',
  parent_id INT DEFAULT 0 COMMENT '上级推荐人ID',
  level INT DEFAULT 1 COMMENT '用户等级 1-普通 2-一级分销 3-二级分销',
  total_commission DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计佣金',
  available_commission DECIMAL(10,2) DEFAULT 0.00 COMMENT '可用佣金',
  status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_parent_id (parent_id),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
  original_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '原价',
  stock INT DEFAULT 0 COMMENT '库存',
  sales INT DEFAULT 0 COMMENT '销量',
  image VARCHAR(255) DEFAULT '' COMMENT '商品图片',
  images TEXT COMMENT '商品轮播图，JSON格式',
  category_id INT DEFAULT 0 COMMENT '分类ID',
  commission_rate DECIMAL(5,2) DEFAULT 10.00 COMMENT '佣金比例%',
  status TINYINT DEFAULT 1 COMMENT '状态 1-上架 0-下架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_id (category_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(255) DEFAULT '' COMMENT '分类图标',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  user_id INT NOT NULL COMMENT '用户ID',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  status TINYINT DEFAULT 0 COMMENT '订单状态 0-待支付 1-已支付 2-已发货 3-已完成 4-已取消',
  pay_time TIMESTAMP NULL COMMENT '支付时间',
  delivery_time TIMESTAMP NULL COMMENT '发货时间',
  finish_time TIMESTAMP NULL COMMENT '完成时间',
  receiver_name VARCHAR(50) DEFAULT '' COMMENT '收货人姓名',
  receiver_phone VARCHAR(20) DEFAULT '' COMMENT '收货人电话',
  receiver_address VARCHAR(255) DEFAULT '' COMMENT '收货地址',
  remark VARCHAR(500) DEFAULT '' COMMENT '订单备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_order_no (order_no),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  product_id INT NOT NULL COMMENT '商品ID',
  product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
  product_image VARCHAR(255) DEFAULT '' COMMENT '商品图片',
  price DECIMAL(10,2) NOT NULL COMMENT '商品单价',
  quantity INT NOT NULL DEFAULT 1 COMMENT '购买数量',
  total_price DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  commission_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT '佣金比例%',
  commission_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '佣金金额',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';

CREATE TABLE IF NOT EXISTS commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '获得佣金的用户ID',
  from_user_id INT NOT NULL COMMENT '产生佣金的下级用户ID',
  order_id INT NOT NULL COMMENT '关联订单ID',
  order_item_id INT NOT NULL COMMENT '订单项ID',
  amount DECIMAL(10,2) NOT NULL COMMENT '佣金金额',
  level INT NOT NULL COMMENT '佣金层级 1-一级 2-二级',
  status TINYINT DEFAULT 0 COMMENT '状态 0-待结算 1-已结算 2-已取消',
  settled_at TIMESTAMP NULL COMMENT '结算时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='佣金记录表';

CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  fee DECIMAL(10,2) DEFAULT 0.00 COMMENT '手续费',
  actual_amount DECIMAL(10,2) NOT NULL COMMENT '实际到账金额',
  status TINYINT DEFAULT 0 COMMENT '状态 0-待审核 1-审核通过 2-审核拒绝 3-已打款',
  pay_account VARCHAR(100) DEFAULT '' COMMENT '收款账号',
  pay_name VARCHAR(50) DEFAULT '' COMMENT '收款人姓名',
  remark VARCHAR(500) DEFAULT '' COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';

INSERT INTO categories (name, sort) VALUES 
('数码产品', 1),
('服装鞋包', 2),
('美妆护肤', 3),
('食品生鲜', 4),
('家居生活', 5);

INSERT INTO products (name, description, price, original_price, stock, sales, image, category_id, commission_rate) VALUES
('无线蓝牙耳机', '高音质无线蓝牙耳机，主动降噪，续航24小时', 299.00, 399.00, 100, 50, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20earbuds%20product%20photo%20white%20background&image_size=square', 1, 15.00),
('智能手表', '多功能智能手表，心率监测，运动追踪', 599.00, 799.00, 80, 30, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20watch%20product%20photo%20white%20background&image_size=square', 1, 12.00),
('时尚双肩包', '大容量时尚双肩包，防水面料，多隔层设计', 199.00, 299.00, 150, 80, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20backpack%20product%20photo%20white%20background&image_size=square', 2, 18.00),
('保湿精华液', '深层保湿精华液，补水锁水，改善肌肤干燥', 168.00, 258.00, 200, 120, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=skincare%20serum%20bottle%20product%20photo%20white%20background&image_size=square', 3, 20.00),
('有机坚果礼盒', '精选有机坚果礼盒，健康零食，送礼佳品', 128.00, 168.00, 300, 200, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20nuts%20gift%20box%20product%20photo%20white%20background&image_size=square', 4, 10.00),
('北欧风台灯', '北欧简约风格台灯，护眼LED，三档调光', 159.00, 229.00, 90, 45, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20desk%20lamp%20product%20photo%20white%20background&image_size=square', 5, 15.00),
('运动跑步鞋', '轻量透气跑步鞋，缓震舒适，适合日常运动', 369.00, 499.00, 120, 65, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20running%20shoes%20product%20photo%20white%20background&image_size=square', 2, 16.00),
('平板电脑支架', '可调节平板电脑支架，铝合金材质，稳固耐用', 89.00, 129.00, 180, 95, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20stand%20holder%20product%20photo%20white%20background&image_size=square', 1, 12.00);
