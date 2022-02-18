const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require('express-session'); //session library
const MongoDBStore = require("connect-mongodb-session")(session); //connect mongodb session to store session in db

const errorController = require("./controller/error");
const User = require("./models/user");

const MONGODB_URI = 'mongodb+srv://thinh28042001:aHUkM4jcebhXAkBY@cluster0.bihtk.mongodb.net/myFirstDatabase';

const app = express();
const store = new MongoDBStore({ // Create db session to store in mongodb
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

// file routers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ // set configure session
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

//routers
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//mongoose connect
mongoose
    .connect(
        MONGODB_URI
    )
    .then((result) => {
        User
            .findOne()
            .then((user) => {
                if (!user) {
                    const user = new User({
                        name: "Thinh",
                        email: "hoangthinhpro2001@gmail.com",
                        cart: {
                            items: [],
                        },
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .then(() => {
        console.log("Connected Database...");
    })
    .catch((err) => {
        console.log(err);
    });