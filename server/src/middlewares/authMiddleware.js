const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const env = require("../config/env");

/**
 * Auth middleware: verifies JWT from Authorization header
 * and attaches user payload to req.user.
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_SECRET);

  // Verify user still exists in DB
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError("User belonging to this token no longer exists", 401);
  }

  req.user = { userId: decoded.userId, role: decoded.role };
  next();
});

module.exports = authMiddleware;