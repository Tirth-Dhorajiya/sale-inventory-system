const express = require("express");
const { purchase } = require("../controllers/purchaseController");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, purchase);

module.exports = router;
