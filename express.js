const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session"); //session library
const MongoDBStore = require("connect-mongodb-session")(session); //connect mongodb session to store session in db
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controller/error");
const User = require("./models/user");

require("dotenv").config();

const app = express();

//create collection session to retrieve data session
const store = new MongoDBStore({
  // Create db session to store in mongodb
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

// file routers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const jsonRoutes = require("./routes/json");

//middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "/public")));

//create session and setting configure session
app.use(
  session({
    // set configure session
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

//session find by id user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//routers
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(jsonRoutes); //Route JSON

app.use(errorController.get404);

//mongoose connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .then(() => {
    console.log("Connected Database...");
  })
  .catch((err) => {
    console.log(err);
  });
