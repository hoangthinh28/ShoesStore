const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    require: false,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId, // Object ID product
          ref: "Product", //relation model Product
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    // find index product ID in cart to equal product id in product
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save(); // update cart after add to product
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString(); // check id product is equals to id product in cart
  });
  this.cart.items = updatedCartItems;
  return this.save(); // update after remove product in cart
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }; // cart is empty after user click button order and remove products in cart
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // {items: []}
//         this._id = id;
//     }

//     //insert user
//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     //add product in cart
//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         };
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }

//     //fetch products in cart
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p, quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     //delete product in cart
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });

//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             );
//     }

//     //add order
//     addOrder() {
//         const db = getDb();
//         return this
//             .getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db
//                     .collection('orders')
//                     .insertOne(order)
//             })
//             .then(result => {
//                 this.cart = { items: [] };
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     );
//             });
//     }

//     //get order in database
//     getOrders() {
//         const db = getDb();
//         return db
//             .collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray();
//     }

//     //find id by user
//     static findByPk(userId) {
//         const db = getDb();
//         return db
//             .collection('users')
//             .findOne({ _id: new ObjectId(userId) })
//             .then(user => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = User;
