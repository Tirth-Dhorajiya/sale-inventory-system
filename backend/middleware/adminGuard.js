const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../utils/constants");

const adminGuard = (req, _res, next) => {
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Access denied. Admin privileges required.",
    );
  }
  next();
};

module.exports = adminGuard;
