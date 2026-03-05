const User = require("../models/User");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");

const listProviders = async ({ status }) => {
  const filter = { role: "provider" };

  if (status === "approved") {
    filter.approvalStatus = "approved";
  } else if (status === "pending") {
    filter.approvalStatus = { $in: ["pending", undefined] };
  } else if (status === "rejected") {
    filter.approvalStatus = "rejected";
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
  provider.approvalStatus = isApproved ? "approved" : "rejected";
  await provider.save();

  return provider;
};

const getAnalytics = async () => {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalUsers,
    totalProviders,
    totalReviews,
    bookingStats,
    monthlyBookings,
    monthlyRevenue,
    statusDistribution,
    monthlyUsers,
  ] = await Promise.all([
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
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$priceSnapshot", 0],
            },
          },
        },
      },
    ]),
    // Monthly bookings (last 12 months)
    Booking.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    // Monthly revenue from completed bookings (last 12 months)
    Booking.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$priceSnapshot" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    // Booking status distribution
    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    // Monthly user registrations (last 12 months)
    User.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const aggregatedStats = bookingStats[0] || {
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    averageBookingPrice: 0,
    totalRevenue: 0,
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
    totalRevenue: aggregatedStats.totalRevenue,
    totalReviews,
    monthlyBookings: monthlyBookings.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      count: m.count,
    })),
    monthlyRevenue: monthlyRevenue.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      revenue: m.revenue,
    })),
    statusDistribution: statusDistribution.map((s) => ({
      status: s._id,
      count: s.count,
    })),
    monthlyUsers: monthlyUsers.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      count: m.count,
    })),
  };
};

const listReviews = async () => {
  const reviews = await Review.find()
    .populate("customerId", "name email")
    .populate("providerId", "name email")
    .populate({
      path: "bookingId",
      select: "categoryId",
      populate: { path: "categoryId", select: "name" },
    })
    .sort({ createdAt: -1 });

  return reviews;
};
const listBookings = async ({ status, page = 1, limit = 20 } = {}) => {
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("customerId", "name email city")
      .populate("providerId", "name email city")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v"),
    Booking.countDocuments(query),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    bookings,
  };
};

module.exports = {
  listProviders,
  updateProviderApproval,
  getAnalytics,
  listReviews,
  listBookings,
};
