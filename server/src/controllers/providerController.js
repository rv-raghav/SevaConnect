const asyncHandler = require("../utils/asyncHandler");
const providerService = require("../services/providerService");

/**
 * POST /api/provider/profile
 * Create or update provider profile.
 */
const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const profile = await providerService.createOrUpdateProfile(
    req.user.userId,
    req.body
  );

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * GET /api/provider/profile
 * Get current provider's own profile.
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await providerService.getMyProfile(req.user.userId);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * GET /api/providers
 * Get all available, approved providers with optional filters.
 */
const getProviders = asyncHandler(async (req, res) => {
  const { city, category } = req.query;
  const providers = await providerService.getProviders({ city, category });

  res.status(200).json({
    success: true,
    data: providers,
  });
});

module.exports = { createOrUpdateProfile, getMyProfile, getProviders };
