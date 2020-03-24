const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products"
            });
        })
        .catch(err => console.log(err));
};

exports.getAddProducts = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        title,
        price,
        imageUrl,
        description,
        null,
        req.user._id
    );
    product
        .save()
        .then(() => {
            console.log("ADDED SUCCESSFULLY!!");
            res.redirect("/");
        })
        .catch(err => console.log(err));
};

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        if (!product) {
            console.log("Product not found");
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImage = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDes = req.body.description;
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedImage,
        updatedDes,
        prodId
    );
    product
        .save()
        .then(result => {
            console.log("UPDATED!");
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log("DELETED!!");
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err));
};
