const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", authController.postSignUp);

module.exports = router;
