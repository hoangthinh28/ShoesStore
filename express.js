const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const errorController = require("./controller/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

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

app.use((req, res, next) => {
    User.findById("62020e859b0b1aeaab2ff3a3")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

//routers
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//mongoose connect
mongoose
    .connect(
        "mongodb+srv://thinh28042001:aHUkM4jcebhXAkBY@cluster0.bihtk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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