const express = require("express");
const router = express.Router();

// import controller
const productController = require('../controllers/productController');

// rotte
router.get("/", productController.index);            // GET /api/product
router.get("/:slug", productController.show);       // GET /api/product/:slug

module.exports = router;