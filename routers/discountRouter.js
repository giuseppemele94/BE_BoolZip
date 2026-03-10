const express = require("express");
const router = express.Router();

const discountController = require("../controllers/discountController");

// lista coupon
router.get("/", discountController.index);
// singolo coupon
//router.get("/", discountController.show)


// verifica codice sconto
router.post("/check", discountController.checkCoupon);



module.exports = router;