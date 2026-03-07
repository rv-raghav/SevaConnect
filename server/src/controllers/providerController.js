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

/**
 * GET /api/providers/:id
 * Get a single provider profile by user ID.
 */
const getProviderById = asyncHandler(async (req, res) => {
  const profile = await providerService.getProviderById(req.params.id);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * GET /api/provider/stats
 * Get dashboard stats for current provider.
 */
const getProviderStats = asyncHandler(async (req, res) => {
  const stats = await providerService.getProviderStats(req.user.userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = { createOrUpdateProfile, getMyProfile, getProviders, getProviderById, getProviderStats };
