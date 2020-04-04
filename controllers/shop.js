const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                is_authenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/shop", {
                prods: products,
                pageTitle: "Shop",
                path: "/products",
                is_authenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
                is_authenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.session.user
        .populate("cart.items.product", "title")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                products: products,
                is_authenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const procId = req.body.productId;
    Product.findById(procId)
        .then((product) => {
            req.session.user.addToCart(product);
        })
        .then(() => {
            res.redirect("/");
        });
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.session.user.removeFromCart(prodId).then(() => {
        res.redirect("/cart");
    });
};

exports.getOrder = (req, res, next) => {
    Order.find({ userId: req.session.user })
        .populate("items.product", "title")
        .exec(function (err, orders) {
            if (!err) {
                req.session.user.cart.items = [];
                req.session.user.save();
                res.render("shop/order", {
                    pageTitle: "Order",
                    path: "/order",
                    orders: orders,
                    is_authenticated: req.session.isLoggedIn,
                });
            }
        });
    // .then(orders => {});
};

exports.postOrder = (req, res, next) => {
    Order.create({
        userId: req.session.user,
        items: req.session.user.cart.items,
    })
        .then(() => {
            res.redirect("/order");
        })
        .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};
