const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORDEMAIL,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true; //check condition isLoggedIn true
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirmPassword;

  let mailOption = {
    to: email,
    from: "hoangrey272284@gmail.com",
    subject: "Signup succeeded",
    html: "<h1>You successfully signed up!</h1>",
  };

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        // Check exist account
        req.flash(
          "error",
          "Email exists already, please pick a different one."
        );
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12) // hash Password
        .then((hashedPassword) => {
          const user = new User({
            //object initialization
            email: email,
            password: hashedPassword,
            cart: { item: [] },
          });
          return user.save();
        })
        .then((result) => {
          console.log(result);
          res.redirect("/login");
          return transporter.sendMail(mailOption, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Sent email successful!!!");
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
