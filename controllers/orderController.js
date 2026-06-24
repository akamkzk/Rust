const { pool, query, queryOne } = require('../config/db');
const { success, error, notFound, serverError } = require('../utils/response');

const generateOrderNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
};

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { items, receiverName, receiverPhone, receiverAddress, remark } = req.body;

    if (!items || items.length === 0) {
      await connection.rollback();
      return error(res, '请选择商品');
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      await connection.rollback();
      return error(res, '请填写完整的收货信息');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await queryOne(
        'SELECT * FROM products WHERE id = ? AND status = 1',
        [item.productId]
      );

      if (!product) {
        await connection.rollback();
        return error(res, `商品不存在或已下架`);
      }

      if (product.stock < item.quantity) {
        await connection.rollback();
        return error(res, `商品【${product.name}】库存不足`);
      }

      const totalPrice = Number((product.price * item.quantity).toFixed(2));
      const commissionAmount = Number((totalPrice * product.commission_rate / 100).toFixed(2));

      totalAmount += totalPrice;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: item.quantity,
        totalPrice,
        commissionRate: product.commission_rate,
        commissionAmount
      });

      await connection.execute(
        'UPDATE products SET stock = stock - ?, sales = sales + ? WHERE id = ?',
        [item.quantity, item.quantity, product.id]
      );
    }

    const orderNo = generateOrderNo();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (order_no, user_id, total_amount, receiver_name, receiver_phone, receiver_address, remark) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderNo, userId, totalAmount, receiverName, receiverPhone, receiverAddress, remark || '']
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, total_price, commission_rate, commission_amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.productImage, item.price, item.quantity, item.totalPrice, item.commissionRate, item.commissionAmount]
      );
    }

    const user = await queryOne('SELECT parent_id FROM users WHERE id = ?', [userId]);

    if (user && user.parent_id) {
      let currentParentId = user.parent_id;
      let level = 1;
      const maxLevel = 2;
      const levelRates = [1, 0.5];

      while (currentParentId && level <= maxLevel) {
        const parentUser = await queryOne('SELECT id, status FROM users WHERE id = ?', [currentParentId]);
        
        if (!parentUser || parentUser.status !== 1) {
          break;
        }

        const rate = levelRates[level - 1] || 0;

        for (const item of orderItems) {
          const commissionAmount = Number((item.commissionAmount * rate).toFixed(2));
          
          if (commissionAmount > 0) {
            const [commResult] = await connection.execute(
              `INSERT INTO commissions (user_id, from_user_id, order_id, order_item_id, amount, level, status) 
               VALUES (?, ?, ?, ?, ?, ?, 0)`,
              [currentParentId, userId, orderId, 0, commissionAmount, level]
            );
          }
        }

        const nextParent = await queryOne('SELECT parent_id FROM users WHERE id = ?', [currentParentId]);
        currentParentId = nextParent ? nextParent.parent_id : 0;
        level++;
      }
    }

    await connection.commit();

    success(res, { orderId, orderNo, totalAmount }, '订单创建成功');
  } catch (err) {
    await connection.rollback();
    console.error('创建订单错误:', err);
    serverError(res, '创建订单失败');
  } finally {
    connection.release();
  }
};

const getOrderList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10, status } = req.query;

    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE user_id = ?';
    const params = [userId];

    if (status !== undefined && status !== '') {
      whereClause += ' AND status = ?';
      params.push(parseInt(status));
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
      params
    );
    const total = countResult.total;

    const orders = await query(
      `SELECT * FROM orders ${whereClause}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), parseInt(offset)]
    );

    for (const order of orders) {
      order.items = await query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
    }

    success(res, {
      list: orders,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }, '获取订单列表成功');
  } catch (err) {
    console.error('获取订单列表错误:', err);
    serverError(res, '获取订单列表失败');
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await queryOne(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!order) {
      return notFound(res, '订单不存在');
    }

    order.items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    success(res, order, '获取订单详情成功');
  } catch (err) {
    console.error('获取订单详情错误:', err);
    serverError(res, '获取订单详情失败');
  }
};

const payOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { id } = req.params;

    const order = await queryOne(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!order) {
      await connection.rollback();
      return notFound(res, '订单不存在');
    }

    if (order.status !== 0) {
      await connection.rollback();
      return error(res, '订单状态不正确');
    }

    await connection.execute(
      'UPDATE orders SET status = 1, pay_time = NOW() WHERE id = ?',
      [id]
    );

    const commissions = await query(
      'SELECT * FROM commissions WHERE order_id = ? AND status = 0',
      [id]
    );

    for (const comm of commissions) {
      await connection.execute(
        'UPDATE users SET total_commission = total_commission + ?, available_commission = available_commission + ? WHERE id = ?',
        [comm.amount, comm.amount, comm.user_id]
      );
      await connection.execute(
        'UPDATE commissions SET status = 1, settled_at = NOW() WHERE id = ?',
        [comm.id]
      );
    }

    await connection.commit();

    success(res, null, '支付成功');
  } catch (err) {
    await connection.rollback();
    console.error('支付订单错误:', err);
    serverError(res, '支付失败');
  } finally {
    connection.release();
  }
};

const cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { id } = req.params;

    const order = await queryOne(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!order) {
      await connection.rollback();
      return notFound(res, '订单不存在');
    }

    if (order.status !== 0) {
      await connection.rollback();
      return error(res, '只有待支付的订单才能取消');
    }

    await connection.execute(
      'UPDATE orders SET status = 4 WHERE id = ?',
      [id]
    );

    const orderItems = await query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [id]
    );

    for (const item of orderItems) {
      await connection.execute(
        'UPDATE products SET stock = stock + ?, sales = sales - ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }

    await connection.execute(
      'UPDATE commissions SET status = 2 WHERE order_id = ?',
      [id]
    );

    await connection.commit();

    success(res, null, '订单取消成功');
  } catch (err) {
    await connection.rollback();
    console.error('取消订单错误:', err);
    serverError(res, '取消订单失败');
  } finally {
    connection.release();
  }
};

module.exports = {
  createOrder,
  getOrderList,
  getOrderDetail,
  payOrder,
  cancelOrder
};
