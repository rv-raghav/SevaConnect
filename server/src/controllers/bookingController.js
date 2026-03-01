const asyncHandler = require("../utils/asyncHandler");
const bookingService = require("../services/bookingService");

/**
 * POST /api/bookings
 * Customer creates booking
 */
const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking({
    customerId: req.user.userId,
    providerId: req.body.providerId,
    categoryId: req.body.categoryId,
    address: req.body.address,
    city: req.body.city,
    scheduledDateTime: req.body.scheduledDateTime,
    notes: req.body.notes,
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

/**
 * PATCH /api/bookings/:id/cancel
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user.userId,
    req.user.role
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * PATCH /api/bookings/:id/accept
 */
const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.acceptBooking(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * PATCH /api/bookings/:id/start
 */
const startBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.startBooking(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * PATCH /api/bookings/:id/complete
 */
const completeBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.completeBooking(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * PATCH /api/bookings/:id/reschedule
 */
const rescheduleBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.rescheduleBooking(
    req.params.id,
    req.user.userId,
    req.body.scheduledDateTime
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

module.exports = {
  createBooking,
  cancelBooking,
  acceptBooking,
  startBooking,
  completeBooking,
  rescheduleBooking,
};