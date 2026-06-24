const { verifyToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/response');
const { queryOne } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return unauthorized(res, '请先登录');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return unauthorized(res, '登录已过期，请重新登录');
  }

  try {
    const user = await queryOne(
      'SELECT id, username, nickname, phone, avatar, parent_id, level, total_commission, available_commission, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return unauthorized(res, '用户不存在');
    }

    if (user.status !== 1) {
      return unauthorized(res, '账号已被禁用');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return serverError(res);
  }
};

module.exports = authMiddleware;
