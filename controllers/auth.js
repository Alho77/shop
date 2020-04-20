const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: req.flash("error"),
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
        resetPassToken: token,
        resetPassTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            res.render("auth/reset-password-form", {
                pageTitle: "New Password",
                path: "/new-password",
                errorMessage: req.flash("message"),
                userId: user._id.toString(),
            });
        })
        .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
    res.render("auth/reset-password", {
        path: "/reset-password",
        pageTitle: "Reset Password",
        message: req.flash("message"),
    });
};

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        enticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid email or password");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((isMatched) => {
                    if (isMatched) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect("/");
                        });
                    }
                    req.flash("error", "Invalid email or password");
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

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return redirect("/reset-password");
        }
        const token = buffer.toString("hex");

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash("message", "Invalid email");
                    return res.redirect("/reset-password");
                }
                user.resetPassToken = token;
                user.resetPassTokenExpiration = Date.now() + 3600000;
                return user.save().then((result) => {
                    const url = `http://127.0.0.1:3000/reset-password/${token}`;
                    console.log(url);

                    req.flash(
                        "message",
                        "The link has been sent to your email, check your mail"
                    );
                    res.redirect("/reset-password");
                });
            })

            .catch((err) => console.log(err));
    });
};

exports.postNewPassword = (req, res, next) => {
    const { password, confirmPassword, userId } = req.body;
    let newUser = null;

    User.findById(userId)
        .then((user) => {
            newUser = user;
            return bcrypt.hash(password, 12);
        })
        .then((hashPassword) => {
            newUser.password = hashPassword;
            newUser.resetPassToken = undefined;
            newUser.resetPassTokenExpiration = undefined;
            return newUser.save();
        })
        .then(() => {
            res.redirect("/login");
        })
        .catch((err) => console.log(err));
};
