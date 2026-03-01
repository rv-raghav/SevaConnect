const ProviderProfile = require("../models/ProviderProfile");
const ServiceCategory = require("../models/ServiceCategory");
const User = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * Create or update provider profile.
 * - Only role = provider
 * - Validates category IDs exist
 * - Upserts (creates if not exists, updates if exists)
 */
const createOrUpdateProfile = async (userId, data) => {
  // Verify user is a provider
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.role !== "provider") {
    throw new AppError("Only providers can create a profile", 403);
  }

  // Validate category IDs if provided
  if (data.categories && data.categories.length > 0) {
    const validCategories = await ServiceCategory.find({
      _id: { $in: data.categories },
      isActive: true,
    });

    if (validCategories.length !== data.categories.length) {
      throw new AppError("One or more category IDs are invalid or inactive", 400);
    }
  }

  // Upsert: create if not exists, update if exists
  const profile = await ProviderProfile.findOneAndUpdate(
    { userId },
    {
      userId,
      ...data,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  )
    .populate("categories", "name")
    .populate("userId", "name city");

  return profile;
};

/**
 * Get current provider's own profile.
 */
const getMyProfile = async (userId) => {
  const profile = await ProviderProfile.findOne({ userId })
    .populate("categories", "name")
    .populate("userId", "name city email")
    .select("-__v");

  if (!profile) {
    throw new AppError("Profile not found. Please create a profile first.", 404);
  }

  return profile;
};

/**
 * Get providers with optional city and category filters.
 * Only returns approved, available providers.
 */
const getProviders = async ({ city, category }) => {
  // Build user filter: must be approved provider
  const userFilter = {
    role: "provider",
    isApproved: true,
  };
  if (city) {
    userFilter.city = { $regex: new RegExp(`^${city}$`, "i") };
  }

  // Find matching user IDs
  const matchingUsers = await User.find(userFilter).select("_id");
  const userIds = matchingUsers.map((u) => u._id);

  if (userIds.length === 0) {
    return [];
  }

  // Build profile filter
  const profileFilter = {
    userId: { $in: userIds },
    availabilityStatus: "available",
  };
  if (category) {
    profileFilter.categories = category;
  }

  const providers = await ProviderProfile.find(profileFilter)
    .populate("userId", "name city")
    .populate("categories", "name")
    .select("-__v");

  return providers;
};

module.exports = { createOrUpdateProfile, getMyProfile, getProviders };
