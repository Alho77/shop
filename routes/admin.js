const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", adminController.getProducts);

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProducts);

router.get("/edit-product/:productId", adminController.getEditProducts);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

exports.routes = router;
