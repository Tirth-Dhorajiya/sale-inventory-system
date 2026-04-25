const express = require("express");
const { addToCart, getCart } = require("../controllers/cartController");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCart);

module.exports = router;
