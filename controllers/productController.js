const { query, queryOne } = require('../config/db');
const { success, error, notFound, serverError } = require('../utils/response');

const getProductList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, categoryId, keyword, sort = 'default' } = req.query;
    
    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE status = 1';
    const params = [];

    if (categoryId) {
      whereClause += ' AND category_id = ?';
      params.push(categoryId);
    }

    if (keyword) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${keyword}%`);
    }

    let orderBy = 'ORDER BY id DESC';
    if (sort === 'sales') {
      orderBy = 'ORDER BY sales DESC';
    } else if (sort === 'price_asc') {
      orderBy = 'ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'ORDER BY price DESC';
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countResult.total;

    const products = await query(
      `SELECT id, name, price, original_price, stock, sales, image, commission_rate, category_id 
       FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), parseInt(offset)]
    );

    success(res, {
      list: products,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    }, '获取商品列表成功');
  } catch (err) {
    console.error('获取商品列表错误:', err);
    serverError(res, '获取商品列表失败');
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await queryOne(
      `SELECT * FROM products WHERE id = ? AND status = 1`,
      [id]
    );

    if (!product) {
      return notFound(res, '商品不存在或已下架');
    }

    success(res, product, '获取商品详情成功');
  } catch (err) {
    console.error('获取商品详情错误:', err);
    serverError(res, '获取商品详情失败');
  }
};

const getCategoryList = async (req, res) => {
  try {
    const categories = await query(
      'SELECT id, name, icon, sort FROM categories WHERE status = 1 ORDER BY sort ASC, id ASC'
    );
    success(res, categories, '获取分类列表成功');
  } catch (err) {
    console.error('获取分类列表错误:', err);
    serverError(res, '获取分类列表失败');
  }
};

module.exports = {
  getProductList,
  getProductDetail,
  getCategoryList
};
