const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/"
            });
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("shop/shop", {
                prods: products,
                pageTitle: "Shop",
                path: "/products"
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products"
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const procId = req.body.productId;
    Product.findById(procId)
        .then(product => {
            req.user.addToCart(product);
        })
        .then(() => {
            res.redirect("/");
        });
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId).then(() => {
        res.redirect("/cart");
    });
};

exports.getOrder = (req, res, next) => {
    req.user
        .getOrder()
        .then(orders => {
            res.render("shop/order", {
                pageTitle: "Order",
                path: "/order",
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect("/order");
        })
        .catch(err => console.log(err));
};
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};
