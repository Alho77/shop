const fs = require("fs");
const path = require("path");

const Product = require("./product");

const getCartFromFile = cb => {
    filePath = path.join(
        path.dirname(process.mainModule.filename),
        "data",
        "cart.json"
    );
    fs.readFile(filePath, (err, fileContent) => {
        if (err) {
            return cb({ products: [], totalPrice: 0 });
        }
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Cart {
    static addProduct(id, price) {
        getCartFromFile(cart => {
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product/ increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +price;
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price) {
        getCartFromFile(cart => {
            const product = cart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            cart.products = cart.products.filter(prod => prod.id !== id);
            cart.totalPrice = cart.totalPrice - price * productQty;
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static fetchCart(cb) {
        getCartFromFile(cb);
    }
};
