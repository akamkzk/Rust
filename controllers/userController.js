const bcrypt = require('bcryptjs');
const { query, queryOne } = require('../config/db');
const { success, error, serverError } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { username, password, nickname, phone, parentId } = req.body;

    if (!username || !password) {
      return error(res, '用户名和密码不能为空');
    }

    if (username.length < 3 || username.length > 20) {
      return error(res, '用户名长度应为3-20个字符');
    }

    if (password.length < 6) {
      return error(res, '密码长度不能少于6位');
    }

    const existingUser = await queryOne('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return error(res, '用户名已存在');
    }

    let parentUserId = 0;
    if (parentId) {
      const parentUser = await queryOne('SELECT id, level FROM users WHERE id = ?', [parentId]);
      if (!parentUser) {
        return error(res, '推荐人不存在');
      }
      parentUserId = parentUser.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (username, password, nickname, phone, parent_id) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, nickname || username, phone || '', parentUserId]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    const user = await queryOne(
      'SELECT id, username, nickname, phone, avatar, parent_id, level, total_commission, available_commission FROM users WHERE id = ?',
      [userId]
    );

    success(res, { user, token }, '注册成功');
  } catch (err) {
    console.error('注册错误:', err);
    serverError(res, '注册失败，请稍后重试');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, '用户名和密码不能为空');
    }

    const user = await queryOne('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return error(res, '用户名或密码错误');
    }

    if (user.status !== 1) {
      return error(res, '账号已被禁用，请联系客服');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return error(res, '用户名或密码错误');
    }

    const token = generateToken(user.id);

    const userInfo = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      phone: user.phone,
      avatar: user.avatar,
      parent_id: user.parent_id,
      level: user.level,
      total_commission: user.total_commission,
      available_commission: user.available_commission
    };

    success(res, { user: userInfo, token }, '登录成功');
  } catch (err) {
    console.error('登录错误:', err);
    serverError(res, '登录失败，请稍后重试');
  }
};

const getUserInfo = async (req, res) => {
  try {
    success(res, req.user, '获取用户信息成功');
  } catch (err) {
    console.error('获取用户信息错误:', err);
    serverError(res, '获取用户信息失败');
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { nickname, phone, avatar } = req.body;
    const userId = req.user.id;

    await query(
      'UPDATE users SET nickname = ?, phone = ?, avatar = ? WHERE id = ?',
      [nickname || req.user.nickname, phone || req.user.phone, avatar || req.user.avatar, userId]
    );

    const user = await queryOne(
      'SELECT id, username, nickname, phone, avatar, parent_id, level, total_commission, available_commission FROM users WHERE id = ?',
      [userId]
    );

    success(res, user, '更新成功');
  } catch (err) {
    console.error('更新用户信息错误:', err);
    serverError(res, '更新失败');
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  updateUserInfo
};
