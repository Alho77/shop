const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Shop",
                path: "/products",
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
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.product", "title")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                products: products,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const procId = req.body.productId;
    Product.findById(procId)
        .then((product) => {
            req.user.addToCart(product);
        })
        .then(() => {
            res.redirect("/");
        });
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId).then(() => {
        res.redirect("/cart");
    });
};

exports.getOrder = (req, res, next) => {
    Order.find({ userId: req.user })
        .populate("items.product", "title")
        .exec(function (err, orders) {
            if (!err) {
                req.user.cart.items = [];
                req.user.save();
                res.render("shop/order", {
                    pageTitle: "Order",
                    path: "/order",
                    orders: orders,
                });
            }
        });
};

exports.postOrder = (req, res, next) => {
    Order.create({
        userId: req.user,
        items: req.user.cart.items,
    })
        .then(() => {
            res.redirect("/order");
        })
        .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};
