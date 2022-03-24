const path = require("path");
const express = require("express");
const router = express.Router();
const authControler = require("../controller/auth");

router.get("/login", authControler.getLogin);

router.post("/login", authControler.postLogin);

router.post("/logout", authControler.postLogout);

router.get("/signup", authControler.getSignup);

router.post("/signup", authControler.postSignup);

router.get("/reset", authControler.getResetPassword);

router.post("/reset", authControler.postResetPassword);

router.get("/reset/:token", authControler.getNewPassword);

router.post("/new-password", authControler.postNewPassword);

module.exports = router;
