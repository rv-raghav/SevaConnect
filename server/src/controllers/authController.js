const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

/**
 * POST /api/auth/register
 * Register a new user.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, city } = req.body;
  const { user, token } = await authService.register({
    name,
    email,
    password,
    role,
    city,
  });

  res.status(201).json({
    success: true,
    data: user,
    token,
  });
});

/**
 * POST /api/auth/login
 * Login user.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, getMe };