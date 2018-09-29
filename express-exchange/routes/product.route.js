const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.get('/', ProductController.listAllProducts);

router.post('/:PRODUCTS/prices', ProductController.productPrice);

module.exports = router;