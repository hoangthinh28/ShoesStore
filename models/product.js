const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);


// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             //Update product
//             dbOp = db
//                 .collection('products')
//                 .updateOne({ _id: this._id }, { $set: this });
//         } else {
//             //insert product
//             dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp
//             .then(result => {
//                 console.log("Insert Successfully!");
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     //get all products in DB
//     static fetchAll() {
//         const db = getDb();
//         return db.collection("products")
//             .find()
//             .toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err)
//             });
//     }

//     //Get Product Detail By ID
//     static findByPk(prodId) {
//         const db = getDb();
//         return db.collection("products")
//             .find({ _id: new mongodb.ObjectId(prodId) })
//             .next()
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static deleteById(prodId) {
//         const db = getDb();
//         return db
//             .collection("products")
//             .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

// }

// module.exports = Product;