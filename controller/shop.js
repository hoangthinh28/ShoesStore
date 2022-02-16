const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then((products) => {
            console.log(products);
            res.render("shop/product-list", {
                prods: products,
                docTitle: "All Products",
                path: "/products",
                isAuthenticated: req.isLoggedIn
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
                isAuthenticated: req.isLoggedIn
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
                isAuthenticated: req.isLoggedIn
            }); // render file shop.hbs
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId') // fetch cart products
        .then(users => {
            const products = users.cart.items;
            console.log(products);
            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.isLoggedIn
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
        .removeFromCart(prodId)
        .then(result => {
            console.log(result)
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } }; // _doc exist on the mongoose object and result that is obtained from the database
            })
            const order = new Order({ // 
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            console.log("Order Successful\n" + result)
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order
        .find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                docTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};