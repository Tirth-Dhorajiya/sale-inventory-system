const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { HTTP_STATUS } = require("../utils/constants");

// POST /api/cart  —  Add item to cart (or increment quantity if already exists)
// Body: { productId, quantity }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.userId;

  if (!productId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found.");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    if (quantity > 0) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot remove from empty cart.");
    }
  } else {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      
      // If quantity drops to 0 or below, remove the item entirely
      if (cart.items[existingItemIndex].quantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ product: productId, quantity });
      } else {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Item not found in cart.");
      }
    }

    await cart.save();
  }

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name price category stockQuantity",
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Item added to cart.",
    data: { cart: populatedCart },
  });
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price category stockQuantity",
  );

  if (!cart || cart.items.length === 0) {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        cart: { items: [], totalItems: 0, totalPrice: 0 },
      },
    });
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => {
    const price = item.product ? item.product.price : 0;
    return sum + price * item.quantity;
  }, 0);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      cart: {
        items: cart.items,
        totalItems,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      },
    },
  });
});

module.exports = { addToCart, getCart };
