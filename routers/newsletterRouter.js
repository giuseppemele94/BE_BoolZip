const express = require("express");
const router = express.Router();

// importiamo il controller
const newsletterController = require("../controllers/newsletterController");

// POST /api/newsletter → salva email e invia email di ringraziamento
router.post("/", newsletterController.storeNewsletterEmail);

module.exports = router;