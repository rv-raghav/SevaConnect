const Review = require("../models/Review");
const Booking = require("../models/Booking");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");

/**
 * Create review (customer only)
 */
const createReview = async ({
  bookingId,
  customerId,
  rating,
  comment,
}) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("Not authorized to review this booking", 403);
  }

  if (booking.status !== "completed") {
    throw new AppError(
      "Review can only be submitted after booking completion",
      400
    );
  }

  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    throw new AppError("Review already submitted for this booking", 400);
  }

  const review = await Review.create({
    bookingId,
    customerId,
    providerId: booking.providerId,
    rating,
    comment,
  });

  // Update provider rating
  const profile = await ProviderProfile.findOne({
    userId: booking.providerId,
  });

  if (!profile) {
    throw new AppError("Provider profile not found", 404);
  }

  const newTotal = profile.totalReviews + 1;
  const newAvg =
    (profile.ratingAverage * profile.totalReviews + rating) /
    newTotal;

  profile.totalReviews = newTotal;
  profile.ratingAverage = Number(newAvg.toFixed(2));

  await profile.save();

  return review;
};

/**
 * Admin deletes review (moderation)
 */
const deleteReview = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  await review.deleteOne();

  return { message: "Review deleted successfully" };
};

module.exports = {
  createReview,
  deleteReview,
};