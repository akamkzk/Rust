const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, orderController.createOrder);
router.get('/list', authMiddleware, orderController.getOrderList);
router.get('/detail/:id', authMiddleware, orderController.getOrderDetail);
router.post('/pay/:id', authMiddleware, orderController.payOrder);
router.post('/cancel/:id', authMiddleware, orderController.cancelOrder);

module.exports = router;
