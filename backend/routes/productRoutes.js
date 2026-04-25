const express = require("express");
const {
  createProduct,
  getProducts,
} = require("../controllers/productController");
const authenticate = require("../middleware/auth");
const adminGuard = require("../middleware/adminGuard");

const router = express.Router();

// Admin only — create a new product
router.post("/", authenticate, adminGuard, createProduct);

// Authenticated users — list, search, filter products
router.get("/", authenticate, getProducts);

module.exports = router;
