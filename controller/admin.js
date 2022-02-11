const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageURL,
        userId: req.user // Information User to take Object User ID
    });
    product
        .save() //Creating data in model
        .then((result) => {
            console.log("Create Product");
            console.log(result);
            res.redirect("/");
        })
        .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageURL = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product
        .findById(prodId) //find id product
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageURL;

            return product.save(); //save product
        })
        .then(result => {
            console.log("Updated Product!");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select("title price -_id") // select các trưỜng trong database
        // .populate('userId') //Join các document từ các collections khác
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                docTitle: "Admin Products",
                path: "/admin/products",
            }); // render file shop.hbs
        })
        .catch((err) => console.log(err));
};

//delete product
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId) //remove id product in database
        .then((rs) => {
            console.log("DELETE SUCCESS");
            console.log(rs);
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};