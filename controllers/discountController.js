// controllers/discountController.js
const discountQueries = require("../queries/discountQueries");

// GET /api/discounts - lista sconti
const getAllDiscounts = async (req, res, next) => {
  try {
    const discounts = await discountQueries.getAllDiscounts();
    res.json({ success: true, data: discounts });
  } catch (err) {
    next(err);
  }
};

// GET /api/discounts/:id - singolo sconto
const getDiscountById = async (req, res, next) => {
  try {
    const discount = await discountQueries.getDiscountById(req.params.id);
    if (!discount) return res.status(404).json({ error: "Discount not found" });
    res.json({ success: true, data: discount });
  } catch (err) {
    next(err);
  }
};

// POST /api/discounts - crea nuovo sconto
const createDiscount = async (req, res, next) => {
  try {
    const newDiscount = await discountQueries.createDiscount(req.body);
    res.status(201).json({ success: true, data: newDiscount });
  } catch (err) {
    next(err);
  }
};

// PUT /api/discounts/:id - aggiorna sconto
const updateDiscount = async (req, res, next) => {
  try {
    const updated = await discountQueries.updateDiscount(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Discount not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/discounts/:id - elimina sconto
const deleteDiscount = async (req, res, next) => {
  try {
    const deleted = await discountQueries.deleteDiscount(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Discount not found" });
    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDiscounts, getDiscountById, createDiscount, updateDiscount, deleteDiscount };