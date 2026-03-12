// importiamo express
const express = require("express");

// creiamo il router
const router = express.Router();

// importiamo il controller
const orderController = require('../controllers/orderController');


// tutte le rotte degli ordini

// ottenere tutti gli ordini
router.get("/", orderController.index);

// ottenere un singolo ordine
router.get("/:id", orderController.show);

// creare un ordine
router.post("/", orderController.store);

// aggiungere prodotto all'ordine
router.post("/:id/products", orderController.addProductToOrder);

// rotta checkout completa
router.post("/checkout", orderController.checkout);

module.exports = router;