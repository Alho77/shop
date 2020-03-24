const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:id", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteItem);

router.get("/order", shopController.getOrder);

router.post("/create-order", shopController.postOrder);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
