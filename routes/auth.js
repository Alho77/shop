const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.get("/reset-password", authController.getResetPassword);

router.get("/reset-password/:token", authController.getNewPassword);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", authController.postSignUp);

router.post("/reset-password", authController.postResetPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
