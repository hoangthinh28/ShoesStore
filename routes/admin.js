const path = require("path");

const express = require("express");

const adminControllers = require("../controller/admin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const rootDir = require("../util/path");

// /admin/add-usesrs => GET
router.get("/add-product", isAuth, adminControllers.getAddProduct);

// /admin/products
router.get("/products", isAuth, adminControllers.getProducts);

// /admin/add-users => POST
router.post("/add-product", isAuth, adminControllers.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

router.post("/edit-product", isAuth, adminControllers.postEditProduct);

router.delete("/product/:productId", isAuth, adminControllers.deleteProduct);

module.exports = router;
