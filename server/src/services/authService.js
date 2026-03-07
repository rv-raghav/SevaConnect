const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const env = require("../config/env");

/**
 * Generate JWT with userId and role, expires in 7 days.
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Register a new user.
 * - Validates password length >= 6
 * - Checks email uniqueness
 * - If role = provider, isApproved = false
 * - If role = customer, isApproved = true (customers don't need approval)
 */
const register = async ({ name, email, password, role, city }) => {
  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  // Only allow customer/provider via public registration (never admin)
  const allowedRoles = ["customer", "provider"];
  const userRole = allowedRoles.includes(role) ? role : "customer";
  const isApproved = userRole !== "provider";

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    city,
    isApproved,
  });

  const token = generateToken(user);

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Login user.
 * - Finds user by email (include password field)
 * - Compares password with bcrypt
 * - Returns JWT token
 */
const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Explicitly select password since it's select: false in schema
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Get current user by ID (for /me route).
 */
const getMe = async (userId) => {
  const user = await User.findById(userId).select("-__v");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

module.exports = { register, login, getMe };