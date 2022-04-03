const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const authControler = require("../controller/auth");

const User = require("../models/user");

router.get("/login", authControler.getLogin);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authControler.postLogin
);

router.post("/logout", authControler.postLogout);

router.get("/signup", authControler.getSignup);

router.post(
  "/signup",
  [
    check("email") //Validate email
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            // Check exist account
            return Promise.reject(
              "Email exist already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters"
    ) //Validate password
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      // check password equal to confirm password
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authControler.postSignup
);

router.get("/reset", authControler.getResetPassword);

router.post("/reset", authControler.postResetPassword);

router.get("/reset/:token", authControler.getNewPassword);

router.post("/new-password", authControler.postNewPassword);

module.exports = router;
