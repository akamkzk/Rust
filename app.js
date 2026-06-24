require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { testConnection } = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const distributionRoutes = require('./routes/distributionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/distribution', distributionRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  });
});

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`  分销商城系统启动成功！`);
      console.log(`  服务地址: http://localhost:${PORT}`);
      console.log(`  首页: http://localhost:${PORT}/index.html`);
      console.log(`  登录: http://localhost:${PORT}/login.html`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('启动失败:', error.message);
    process.exit(1);
  }
};

startServer();
