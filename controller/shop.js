const Product = require("../models/product");
const Order = require("../models/order");

const fs = require("fs");
const ejs = require("ejs");
const stripe = require("stripe")(
  "sk_test_51KvNYNBfkWBebjqCc58E3Mtqx2ETWQbBfnHhPbOcDkcXUE8mFKtzvUYCgJWBiMziRjLR7L1W8xPiN0jHiaVtENZT00Tm4vvEVo"
);

const nodemailer = require("nodemailer");
const { db } = require("../models/product");
require("dotenv").config();

const ITEMS_PER_PAGE = 2;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.email.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORDEMAIL,
  },
});

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  const truncateWords = (sentences, amount, tail) => {
    const word = sentences.split(" ");
    if (amount >= word.length) {
      return sentences;
    }
    const truncate = word.slice(0, amount);
    return `${truncate.join(" ")}${tail}`;
  };

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        user: req.session.user,
        truncateWords: truncateWords,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

//Fetching a single product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  const truncateWords = (sentences, amount, tail) => {
    const word = sentences.split(" ");
    if (amount >= word.length) {
      return sentences;
    }
    const truncate = word.slice(0, amount);
    return `${truncate.join(" ")}${tail}`;
  };

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        user: req.session.user,
        truncateWords: truncateWords,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      }); // render file shop.hbs
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // fetch cart products
    .then((users) => {
      const products = users.cart.items;
      console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: products,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId") // fetch cart products
    .then((users) => {
      const products = users.cart.items;
      let total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      //Adding payment stripe
      return stripe.checkout.sessions
        .create({
          payment_method_types: ["card"],
          line_items: products.map((p) => {
            return {
              name: p.productId.title,
              description: p.productId.description,
              amount: p.productId.price * 100,
              currency: "usd",
              quantity: p.quantity,
            };
          }),
          success_url:
            req.protocol + "://" + req.get("host") + "/checkout/success",
          cancel_url:
            req.protocol + "://" + req.get("host") + "/checkout/cancel",
        })
        .then((ses) => {
          res.render("shop/checkout", {
            path: "/checkout",
            docTitle: "Checkout",
            products: products,
            user: req.session.user,
            totalSum: total,
            sessionId: ses.id,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }; // _doc exist on the mongoose object and result that is obtained from the database
      });
      const order = new Order({
        //
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      console.log("Order Successful\n" + result);
      return req.user.clearCart();
    })
    .then(() => {
      fs.readFile("views/mail/email.ejs", "utf-8", (err, data) => {
        //Send mail order success
        if (err) {
          console.log("Error: ", err);
        }
        Order.find({ "user.userId": req.user._id }).then((orders) => {
          const grandTotal = function (arr) {
            return arr.reduce((sum, i) => {
              return sum + i.product.price * i.quantity;
            }, 0);
          };
          let dateFormat = new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          });
          var mailOption = {
            to: req.user.email,
            from: "hoangrey272284@gmail.com",
            subject: "Order succeeded",
            html: ejs.render(data, {
              orders: orders[orders.length - 1],
              userId: req.user._id,
              formatTime: dateFormat,
              total: grandTotal,
            }),
          };

          return transporter.sendMail(mailOption, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Sent email successful!!!");
            }
          });
        });
      });
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }; // _doc exist on the mongoose object and result that is obtained from the database
      });
      const order = new Order({
        //
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      console.log("Order Successful\n" + result);
      return req.user.clearCart();
    })
    .then(() => {
      fs.readFile("views/mail/email.ejs", "utf-8", (err, data) => {
        //Send mail order success
        if (err) {
          console.log("Error: ", err);
        }
        Order.find({ "user.userId": req.user._id }).then((orders) => {
          const grandTotal = function (arr) {
            return arr.reduce((sum, i) => {
              return sum + i.product.price * i.quantity;
            }, 0);
          };
          let dateFormat = new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          });
          var mailOption = {
            to: req.user.email,
            from: "hoangrey272284@gmail.com",
            subject: "Order succeeded",
            html: ejs.render(data, {
              orders: orders[orders.length - 1],
              userId: req.user._id,
              formatTime: dateFormat,
              total: grandTotal,
            }),
          };

          return transporter.sendMail(mailOption, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Sent email successful!!!");
            }
          });
        });
      });
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.getOrders = (req, res, next) => {
  let dateFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      const grandTotal = function (arr) {
        return arr.reduce((sum, i) => {
          return sum + i.product.price * i.quantity;
        }, 0);
      }; // total price in orders
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders: orders.reverse(),
        user: req.session.user,
        formatTime: dateFormat,
        total: grandTotal,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};
