const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { HTTP_STATUS } = require("../utils/constants");

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stockQuantity } = req.body;

  if (!name || price == null || !category || stockQuantity == null) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "All fields are required: name, price, category, stockQuantity.",
    );
  }

  const product = await Product.create({
    name,
    price,
    category,
    stockQuantity,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Product created successfully.",
    data: { product },
  });
});

// Supports: ?search=keyword  &category=electronics  &page=1  &limit=10
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category.toLowerCase();
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        limit: limitNum,
      },
    },
  });
});

module.exports = { createProduct, getProducts };
