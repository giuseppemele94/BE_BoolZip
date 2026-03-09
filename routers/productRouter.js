const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// GET tutti i prodotti con filtri e paginazione
router.get("/", productController.getAllProducts);

// GET prodotto singolo
router.get("/:slug", productController.getProductBySlug);

// POST nuovo prodotto
router.post("/", productController.createProduct);

// PUT modifica prodotto
router.put("/:slug", productController.updateProduct);

// DELETE prodotto
router.delete("/:slug", productController.deleteProduct);

module.exports = router;