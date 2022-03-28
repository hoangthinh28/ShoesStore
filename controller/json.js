const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

//[Get] /user
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      return res.json(users);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Fail Json Get Users");
    });
};

//[Get] /user/:id
exports.getUsersByID = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Fail Json Get User By ID");
    });
};

// [GET] /products
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      return res.json(products);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Fail Json Get Product");
    });
};

// [GET] /product/:id
exports.getProductsId = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then((product) => {
      return res.json(product);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Fail Json Get Product ID");
    });
};

//[GET] /get-orders
exports.getOrders = (req, res, next) => {
  Order.find()
    .then((orders) => {
      return res.json(orders);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Fail Json get Orders");
    });
};

//[GET] /orders/:userId
exports.getOrdersByUserId = (req, res, next) => {
  const userId = req.params.userId;

  Order.find({ "user.userId": userId })
    .then((order) => {
      return res.json(order);
    })
    .catch((err) => {
      console.log(err);
      return res.json("Failure");
    });
};
