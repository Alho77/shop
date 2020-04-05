const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is_auth");

const router = express.Router();

router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes = router;
