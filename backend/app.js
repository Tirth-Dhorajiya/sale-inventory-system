const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const ApiError = require("./utils/ApiError");
const { HTTP_STATUS } = require("./utils/constants");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

const app = express();

// Global Middleware

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — allow all origins in development
app.use(cors());

// Parse JSON request bodies (limit to 10kb to prevent abuse)
app.use(express.json({ limit: "10kb" }));

// Rate limiting — prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use("/api/", limiter);

// Serve Frontend (Vite production build)
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchase", purchaseRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running.",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler — catch undefined routes
app.use((req, _res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `Route not found: ${req.method} ${req.originalUrl}`,
    ),
  );
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new ApiError(HTTP_STATUS.BAD_REQUEST, messages.join(". "));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    err = new ApiError(HTTP_STATUS.CONFLICT, `Duplicate value for: ${field}`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    err = new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid ${err.path}: ${err.value}`,
    );
  }

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER;
  const message = err.message || "Internal Server Error";

  console.error(`❌ [${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
