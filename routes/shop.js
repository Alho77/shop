const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is_auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:id", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteItem);

router.get("/order", isAuth, shopController.getOrder);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/checkout", isAuth, shopController.getCheckout);

module.exports = router;
