const { query, queryOne } = require('../config/db');
const { success, error, serverError } = require('../utils/response');

const getMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 20, level = 1 } = req.query;

    const offset = (page - 1) * pageSize;

    let teamMembers = [];
    let total = 0;

    if (level == 1) {
      const countResult = await queryOne(
        'SELECT COUNT(*) as total FROM users WHERE parent_id = ?',
        [userId]
      );
      total = countResult.total;

      teamMembers = await query(
        `SELECT id, username, nickname, avatar, level, created_at 
         FROM users WHERE parent_id = ? 
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [userId, parseInt(pageSize), parseInt(offset)]
      );
    } else if (level == 2) {
      const countResult = await queryOne(
        `SELECT COUNT(*) as total FROM users 
         WHERE parent_id IN (SELECT id FROM users WHERE parent_id = ?)`,
        [userId]
      );
      total = countResult.total;

      teamMembers = await query(
        `SELECT u.id, u.username, u.nickname, u.avatar, u.level, u.created_at,
                p.username as parent_username, p.nickname as parent_nickname
         FROM users u
         LEFT JOIN users p ON u.parent_id = p.id
         WHERE u.parent_id IN (SELECT id FROM users WHERE parent_id = ?)
         ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
        [userId, parseInt(pageSize), parseInt(offset)]
      );
    }

    success(res, {
      list: teamMembers,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      level: parseInt(level)
    }, '获取团队列表成功');
  } catch (err) {
    console.error('获取团队列表错误:', err);
    serverError(res, '获取团队列表失败');
  }
};

const getCommissionList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 20, status } = req.query;

    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE c.user_id = ?';
    const params = [userId];

    if (status !== undefined && status !== '') {
      whereClause += ' AND c.status = ?';
      params.push(parseInt(status));
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM commissions c ${whereClause}`,
      params
    );
    const total = countResult.total;

    const commissions = await query(
      `SELECT c.*, u.username as from_username, u.nickname as from_nickname,
              o.order_no
       FROM commissions c
       LEFT JOIN users u ON c.from_user_id = u.id
       LEFT JOIN orders o ON c.order_id = o.id
       ${whereClause}
       ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), parseInt(offset)]
    );

    success(res, {
      list: commissions,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }, '获取佣金记录成功');
  } catch (err) {
    console.error('获取佣金记录错误:', err);
    serverError(res, '获取佣金记录失败');
  }
};

const getCommissionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalResult = await queryOne(
      'SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE user_id = ? AND status != 2',
      [userId]
    );

    const pendingResult = await queryOne(
      'SELECT COALESCE(SUM(amount), 0) as pending FROM commissions WHERE user_id = ? AND status = 0',
      [userId]
    );

    const settledResult = await queryOne(
      'SELECT COALESCE(SUM(amount), 0) as settled FROM commissions WHERE user_id = ? AND status = 1',
      [userId]
    );

    const firstLevelCount = await queryOne(
      'SELECT COUNT(*) as count FROM users WHERE parent_id = ?',
      [userId]
    );

    const secondLevelCount = await queryOne(
      `SELECT COUNT(*) as count FROM users 
       WHERE parent_id IN (SELECT id FROM users WHERE parent_id = ?)`,
      [userId]
    );

    success(res, {
      totalCommission: totalResult.total,
      pendingCommission: pendingResult.pending,
      settledCommission: settledResult.settled,
      availableCommission: req.user.available_commission,
      firstLevelCount: firstLevelCount.count,
      secondLevelCount: secondLevelCount.count,
      totalTeamCount: firstLevelCount.count + secondLevelCount.count
    }, '获取佣金统计成功');
  } catch (err) {
    console.error('获取佣金统计错误:', err);
    serverError(res, '获取佣金统计失败');
  }
};

const getParentInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.user.parent_id) {
      return success(res, null, '无推荐人');
    }

    const parent = await queryOne(
      'SELECT id, username, nickname, avatar, level FROM users WHERE id = ?',
      [req.user.parent_id]
    );

    success(res, parent, '获取推荐人信息成功');
  } catch (err) {
    console.error('获取推荐人信息错误:', err);
    serverError(res, '获取推荐人信息失败');
  }
};

const applyWithdraw = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payAccount, payName, remark } = req.body;

    if (!amount || amount <= 0) {
      return error(res, '提现金额不能小于等于0');
    }

    if (amount > req.user.available_commission) {
      return error(res, '可用佣金不足');
    }

    if (!payAccount || !payName) {
      return error(res, '请填写收款账号和收款人姓名');
    }

    const fee = 0;
    const actualAmount = amount - fee;

    await query(
      'UPDATE users SET available_commission = available_commission - ? WHERE id = ?',
      [amount, userId]
    );

    await query(
      `INSERT INTO withdrawals (user_id, amount, fee, actual_amount, pay_account, pay_name, remark) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, amount, fee, actualAmount, payAccount, payName, remark || '']
    );

    const user = await queryOne(
      'SELECT id, available_commission, total_commission FROM users WHERE id = ?',
      [userId]
    );

    success(res, user, '提现申请提交成功');
  } catch (err) {
    console.error('提现申请错误:', err);
    serverError(res, '提现申请失败');
  }
};

const getWithdrawList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 20 } = req.query;

    const offset = (page - 1) * pageSize;

    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM withdrawals WHERE user_id = ?',
      [userId]
    );
    const total = countResult.total;

    const withdrawals = await query(
      `SELECT * FROM withdrawals WHERE user_id = ? 
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, parseInt(pageSize), parseInt(offset)]
    );

    success(res, {
      list: withdrawals,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }, '获取提现记录成功');
  } catch (err) {
    console.error('获取提现记录错误:', err);
    serverError(res, '获取提现记录失败');
  }
};

module.exports = {
  getMyTeam,
  getCommissionList,
  getCommissionStats,
  getParentInfo,
  applyWithdraw,
  getWithdrawList
};
