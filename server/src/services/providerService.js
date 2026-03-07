const ProviderProfile = require("../models/ProviderProfile");
const ServiceCategory = require("../models/ServiceCategory");
const User = require("../models/User");
const Booking = require("../models/Booking");
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
    $or: [
      { approvalStatus: "approved" },
      { isApproved: true },
    ],
  };
  if (city) {
    const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    userFilter.city = { $regex: new RegExp(`^${escapedCity}$`, "i") };
  }

  // Find matching user IDs
  const matchingUsers = await User.find(userFilter).select("_id");
  const userIds = matchingUsers.map((u) => u._id);

  if (userIds.length === 0) {
    return [];
  }

  // Build profile filter — only show providers marked as "available"
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

/**
 * Get a single provider profile by userId.
 */
const getProviderById = async (userId) => {
  const profile = await ProviderProfile.findOne({ userId })
    .populate("userId", "name city")
    .populate("categories", "name")
    .select("-__v");

  if (!profile) {
    throw new AppError("Provider not found", 404);
  }

  return profile;
};

/**
 * Get dashboard stats for a provider (accurate, DB-level aggregation).
 */
const getProviderStats = async (providerId) => {
  const [stats] = await Booking.aggregate([
    { $match: { providerId: new (require("mongoose").Types.ObjectId)(providerId) } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        upcomingBookings: {
          $sum: {
            $cond: [
              { $in: ["$status", ["requested", "confirmed", "in-progress"]] },
              1,
              0,
            ],
          },
        },
        totalEarnings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$priceSnapshot", 0] },
        },
      },
    },
  ]);

  return {
    totalBookings: stats?.totalBookings || 0,
    completedBookings: stats?.completedBookings || 0,
    upcomingBookings: stats?.upcomingBookings || 0,
    totalEarnings: stats?.totalEarnings || 0,
  };
};

module.exports = { createOrUpdateProfile, getMyProfile, getProviders, getProviderById, getProviderStats };
