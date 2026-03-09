// controllers/productController.js
const productQueries = require("../queries/productQueries");

// GET /api/products - lista prodotti con filtri e paginazione
const getAllProducts = async (req, res, next) => {
  try {
    let results = await productQueries.getAllProducts();

    // Filtri per categoria
    if (req.query.category) {
      results = results.filter(p => p.category === req.query.category);
    }

    // Paginazione
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({ success: true, data: results.slice(start, end) });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:slug - singolo prodotto
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productQueries.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products - crea nuovo prodotto
const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productQueries.createProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:slug - aggiorna prodotto
const updateProduct = async (req, res, next) => {
  try {
    const updated = await productQueries.updateProduct(req.params.slug, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:slug - elimina prodotto
const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productQueries.deleteProduct(req.params.slug);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };