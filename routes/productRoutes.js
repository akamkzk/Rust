const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/list', productController.getProductList);
router.get('/detail/:id', productController.getProductDetail);
router.get('/categories', productController.getCategoryList);

module.exports = router;
