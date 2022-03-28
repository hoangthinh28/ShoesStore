const express = require("express");

const router = express.Router();

const jsonController = require("../controller/json");

//users
router.get("/users", jsonController.getAllUsers);

router.get("/users/:id", jsonController.getUsersByID);

//products
router.get("/index-products", jsonController.getProducts);

router.get("/index-products/:id", jsonController.getProductsId);

//orders
router.get("/get-orders", jsonController.getOrders);

router.get("/orders/:userId", jsonController.getOrdersByUserId);

module.exports = router;
