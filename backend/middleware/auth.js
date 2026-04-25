const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../utils/constants");

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Access denied. No token provided.",
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload for use in controllers
    req.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token has expired.");
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token.");
  }
};

module.exports = authenticate;
