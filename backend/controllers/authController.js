const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { HTTP_STATUS } = require("../utils/constants");

// Helper — generate JWT with user payload
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

// POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Name, email, and password are required.",
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Email is already registered.");
  }

  // Create user (password is hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  const token = generateToken(user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "User registered successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required.",
    );
  }

  // Explicitly select password (excluded by default in schema)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

  // Compare candidate password with stored hash
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

  const token = generateToken(user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    },
  });
});

module.exports = { signup, login };
