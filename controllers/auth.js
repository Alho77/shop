const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        is_authenticated: req.session.isLoggedIn,
    });
};
exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        is_authenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5e7bc98eec491e78d24e6ae3")
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect("/");
            });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
};

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.redirect("/signup");
            }

            return bcrypt
                .hash(password, 12)
                .then((hashPassword) => {
                    user = new User({
                        email: email,
                        password: hashPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then(() => {
                    res.redirect("/login");
                });
        })

        .catch((err) => console.log(err));
};
