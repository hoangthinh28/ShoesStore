const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const errorController = require("./controller/error");
// const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//     User
//         .findByPk("61a62c57520f7094c682496b")
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

//routers
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//mongoose connect
mongoose
    .connect('mongodb+srv://thinh28042001:aHUkM4jcebhXAkBY@cluster0.bihtk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
    })
    .then(() => {
        console.log("Connected Database...")
    })
    .catch(err => {
        console.log(err);
    })