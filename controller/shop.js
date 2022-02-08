const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            console.log(products);
            res.render("shop/product-list", {
                prods: products,
                docTitle: "All Products",
                path: "/products",
            })
        })
        .catch((err) => console.log(err));
};

//Fetching a single product
exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product
        .findById(prodId)
        .then((product) => {
            console.log(product);
            res.render("shop/product-detail", {
                product: product,
                docTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                docTitle: "Shop",
                path: "/",
            }); // render file shop.hbs
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(result => {
            console.log(result);
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                docTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};