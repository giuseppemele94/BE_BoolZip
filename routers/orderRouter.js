// importiamo express
const express = require("express");

// creiamo il router
const router = express.Router();

// importiamo il controller
const orderController = require('../controllers/orderController');

// INDEX → GET api/orders
router.get("/", orderController.index);

// SHOW → ordine per id
router.get("/:id", orderController.show);

// rotta di CREATE → POST api/orders
router.post("/", orderController.store);

module.exports = router;