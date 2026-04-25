const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Database Indexes — critical for flash-sale query performance

// Text index: enables fast full-text search on product name
productSchema.index({ name: "text" });

// Category index: fast category-based filtering
productSchema.index({ category: 1 });

// Compound index: optimizes filtered + sorted queries (e.g., category + price)
productSchema.index({ category: 1, price: 1 });

// Stock-aware lookup: speeds up atomic purchase queries
productSchema.index({ _id: 1, stockQuantity: 1 });

module.exports = mongoose.model("Product", productSchema);
