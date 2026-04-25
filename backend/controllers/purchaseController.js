const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { HTTP_STATUS } = require("../utils/constants");

// POST /api/purchase
// Body: { productId, quantity }  — purchase a single product
//   OR: { fromCart: true }       — purchase all items in user's cart
const purchase = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity = 1, fromCart = false } = req.body;

  if (fromCart) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Your cart is empty.");
    }

    const results = await Promise.allSettled(
      cart.items.map(async (item) => {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            stockQuantity: { $gte: item.quantity }, // Atomic check
          },
          {
            $inc: { stockQuantity: -item.quantity }, // Atomic decrement
          },
          { new: true },
        );

        if (!updatedProduct) {
          throw new Error(
            `Insufficient stock for "${item.product.name}". Available: ${item.product.stockQuantity}, Requested: ${item.quantity}`,
          );
        }

        return {
          product: updatedProduct.name,
          quantityPurchased: item.quantity,
          remainingStock: updatedProduct.stockQuantity,
        };
      }),
    );

    const succeeded = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        succeeded.push(result.value);
      } else {
        failed.push({
          product: cart.items[index].product.name,
          reason: result.reason.message,
        });
      }
    });

    if (succeeded.length > 0) {
      const purchasedNames = new Set(succeeded.map((s) => s.product));
      cart.items = cart.items.filter(
        (item) => !purchasedNames.has(item.product.name),
      );
      await cart.save();
    }

    const statusCode =
      failed.length === 0 ? HTTP_STATUS.OK : HTTP_STATUS.CONFLICT;

    return res.status(statusCode).json({
      success: failed.length === 0,
      message:
        failed.length === 0
          ? "All items purchased successfully."
          : "Some items could not be purchased due to insufficient stock.",
      data: { succeeded, failed },
    });
  }

  if (!productId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required.");
  }

  if (quantity < 1) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Quantity must be at least 1.");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
      stockQuantity: { $gte: quantity },
    },
    {
      $inc: { stockQuantity: -quantity },
    },
    { new: true },
  );

  if (!updatedProduct) {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found.");
    }
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      `Insufficient stock. Available: ${productExists.stockQuantity}, Requested: ${quantity}`,
    );
  }

  await Cart.updateOne(
    { user: userId },
    { $pull: { items: { product: productId } } },
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Purchase successful.",
    data: {
      purchase: {
        product: updatedProduct.name,
        quantityPurchased: quantity,
        totalPrice: parseFloat((updatedProduct.price * quantity).toFixed(2)),
        remainingStock: updatedProduct.stockQuantity,
      },
    },
  });
});

module.exports = { purchase };
