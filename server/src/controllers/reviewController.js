const asyncHandler = require("../utils/asyncHandler");
const reviewService = require("../services/reviewService");

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview({
    bookingId: req.body.bookingId,
    customerId: req.user.userId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  createReview,
  deleteReview,
};