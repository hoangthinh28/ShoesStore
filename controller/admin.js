const Product = require("../models/product");

const ITEMS_PER_PAGE = 2;

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    user: req.session.user,
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
    userId: req.user, // Information User to take Object User ID
  });
  product
    .save() //Creating data in model
    .then((result) => {
      console.log("Create Product");
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
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
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageURL = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId) //find id product
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageURL;

      return product
        .save() //save product
        .then((result) => {
          console.log("Updated Product!");
          res.redirect("/admin/products");
        });
    })

    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProduct;

  const truncateWords = (sentences, amount, tail) => {
    const word = sentences.split(" ");
    if (amount >= word.length) {
      return sentences;
    }
    const truncate = word.slice(0, amount);
    return `${truncate.join(" ")}${tail}`;
  };
  Product.find()
    // .select("title price -_id") // select các trưỜng trong database
    // .populate('userId') //Join các document từ các collections khác
    .countDocuments()
    .then((numProducts) => {
      totalProduct = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        user: req.session.user,
        truncateWords: truncateWords,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalProduct,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProduct / ITEMS_PER_PAGE),
      }); // render file shop.hbs
    })
    .catch((err) => console.log(err));
};

//delete product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id }) //remove id product in database
    .then((rs) => {
      console.log("DELETE SUCCESS");
      console.log(rs);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};
