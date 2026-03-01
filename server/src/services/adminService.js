const User = require("../models/User");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");

const listProviders = async ({ approved }) => {
  const filter = { role: "provider" };

  if (approved !== undefined) {
    filter.isApproved = approved;
  }

  const providers = await User.find(filter)
    .select("-password -__v")
    .sort({ createdAt: -1 });

  return providers;
};

const updateProviderApproval = async (providerId, isApproved) => {
  const provider = await User.findById(providerId).select("-password -__v");

  if (!provider) {
    throw new AppError("User not found", 404);
  }

  if (provider.role !== "provider") {
    throw new AppError("User is not a provider", 400);
  }

  provider.isApproved = isApproved;
  await provider.save();

  return provider;
};

const getAnalytics = async () => {
  const [totalUsers, totalProviders, totalReviews, bookingStats] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "provider" }),
      Review.countDocuments(),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            completedBookings: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
            cancelledBookings: {
              $sum: {
                $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
              },
            },
            averageBookingPrice: { $avg: "$priceSnapshot" },
          },
        },
      ]),
    ]);

  const aggregatedStats = bookingStats[0] || {
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    averageBookingPrice: 0,
  };

  const averageBookingPrice = Number(
    (aggregatedStats.averageBookingPrice || 0).toFixed(2)
  );

  return {
    totalUsers,
    totalProviders,
    totalBookings: aggregatedStats.totalBookings,
    completedBookings: aggregatedStats.completedBookings,
    cancelledBookings: aggregatedStats.cancelledBookings,
    averageBookingPrice,
    totalReviews,
  };
};

module.exports = {
  listProviders,
  updateProviderApproval,
  getAnalytics,
};
