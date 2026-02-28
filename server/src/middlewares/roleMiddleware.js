const AppError = require("../utils/AppError");

/**
 * Role-based access control middleware.
 * Factory function that returns middleware allowing only specified roles.
 *
 * Usage: roleMiddleware("admin", "provider")
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};

module.exports = roleMiddleware;