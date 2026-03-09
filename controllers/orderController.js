// controllers/orderController.js
const orderQueries = require("../queries/orderQueries");

// GET /api/orders - lista tutti gli ordini
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderQueries.getAllOrders();
    res.json({ success: true, data: orders }); // restituisce tutti i campi
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id - singolo ordine
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderQueries.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders - crea nuovo ordine
const createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderQueries.createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id - aggiorna ordine
const updateOrder = async (req, res, next) => {
  try {
    const updated = await orderQueries.updateOrder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id - elimina ordine
const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderQueries.deleteOrder(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };