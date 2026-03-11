const express = require("express");
const router = express.Router();

// import controller
const productController = require('../controllers/productController');

// rotte


router.get("/recent", productController.getRecentProducts); // GET /api/product/recent
router.get("/:slug", productController.show);       // GET /api/product/:slug
router.get("/", productController.index);            // GET /api/product
module.exports = router;