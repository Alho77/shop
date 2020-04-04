const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        is_authenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5e7bc98eec491e78d24e6ae3")
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
