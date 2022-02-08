const path = require('path');

const express = require('express');

const adminControllers = require('../controller/admin');

const router = express.Router();

const rootDir = require('../util/path');

// /admin/add-usesrs => GET
router.get('/add-product', adminControllers.getAddProduct);

// /admin/products
router.get('/products', adminControllers.getProducts);

// /admin/add-users => POST
router.post('/add-product', adminControllers.postAddProduct);

router.get('/edit-product/:productId', adminControllers.getEditProduct);

router.post('/edit-product', adminControllers.postEditProduct);

// router.post('/delete-product', adminControllers.postDeleteProduct);

module.exports = router;