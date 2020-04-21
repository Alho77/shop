const express = require("express");
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.get("/reset-password", authController.getResetPassword);

router.get("/reset-password/:token", authController.getNewPassword);

router.post(
    "/login",
    body("email").isEmail().withMessage("Enter an email"),
    authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Invalid Email")
            .custom((value, { req }) => {
                User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject(
                            "Email exists already, pick another one"
                        );
                    }
                });
            }),
        body("password")
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters"),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords not matched");
            }
            return true;
        }),
    ],
    authController.postSignUp
);

router.post(
    "/reset-password",
    body("email").isEmail().withMessage("Enter an email"),
    authController.postResetPassword
);

router.post(
    "/new-password",
    [
        body("password")
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters"),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords not matched");
            }
            return true;
        }),
    ],
    authController.postNewPassword
);

module.exports = router;
