const path = require("path");
const express = require("express");
const router = express.Router();
const authControler = require("../controller/auth");

router.get("/login", authControler.getLogin);

router.post("/login", authControler.postLogin);

router.post("/logout", authControler.postLogout);

module.exports = router;
