require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const initDB = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '123456';
  const dbName = process.env.DB_NAME || 'distribution_mall';

  try {
    console.log('正在连接MySQL服务器...');
    
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true
    });

    console.log('MySQL连接成功！');

    const sqlPath = path.join(__dirname, '..', 'sql', 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('正在执行数据库初始化脚本...');
    await connection.query(sqlContent);

    console.log('数据库初始化成功！');
    console.log(`数据库名: ${dbName}`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    process.exit(1);
  }
};

initDB();
