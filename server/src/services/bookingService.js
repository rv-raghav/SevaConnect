const Booking = require("../models/Booking");
const User = require("../models/User");
const ServiceCategory = require("../models/ServiceCategory");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const { validateTransition } = require("../utils/bookingTransitions");

/**
 * Check scheduling conflict for provider.
 */
const checkConflict = async (providerId, scheduledDateTime) => {
  const conflict = await Booking.findOne({
    providerId,
    scheduledDateTime,
    status: { $in: ["confirmed", "in-progress"] },
  });

  if (conflict) {
    throw new AppError(
      "Provider already has a booking at this time",
      400
    );
  }
};

/**
 * Create booking (customer only)
 */
const createBooking = async ({
  customerId,
  providerId,
  categoryId,
  address,
  city,
  scheduledDateTime,
  notes,
}) => {
  const provider = await User.findById(providerId);
  if (!provider || provider.role !== "provider") {
    throw new AppError("Invalid provider", 400);
  }

  if (!provider.isApproved) {
    throw new AppError("Provider is not approved", 403);
  }

  const providerProfile = await ProviderProfile.findOne({ userId: providerId });
  if (!providerProfile) {
    throw new AppError("Provider profile not found", 404);
  }

  if (providerProfile.availabilityStatus !== "available") {
    throw new AppError("Provider is currently unavailable", 400);
  }

  const category = await ServiceCategory.findById(categoryId);
  if (!category || !category.isActive) {
    throw new AppError("Invalid or inactive category", 400);
  }

  if (new Date(scheduledDateTime) <= new Date()) {
    throw new AppError("Scheduled time must be in the future", 400);
  }

  const booking = await Booking.create({
    customerId,
    providerId,
    categoryId,
    address,
    city,
    scheduledDateTime,
    priceSnapshot: category.basePrice,
    statusHistory: [
      {
        status: "requested",
        changedBy: customerId,
      },
    ],
    notes,
  });

  return booking;
};

/**
 * Cancel booking
 */
const cancelBooking = async (bookingId, actorId, actorRole) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  validateTransition(booking.status, "cancelled", actorRole);

  booking.status = "cancelled";
  booking.cancelledBy = actorRole;
  booking.statusHistory.push({
    status: "cancelled",
    changedBy: actorId,
  });

  await booking.save();
  return booking;
};

/**
 * Accept booking (provider)
 */
const acceptBooking = async (bookingId, providerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Not authorized for this booking", 403);
  }

  validateTransition(booking.status, "confirmed", "provider");

  await checkConflict(booking.providerId, booking.scheduledDateTime);

  booking.status = "confirmed";
  booking.statusHistory.push({
    status: "confirmed",
    changedBy: providerId,
  });

  await booking.save();
  return booking;
};

/**
 * Start booking (provider)
 */
const startBooking = async (bookingId, providerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Not authorized", 403);
  }

  validateTransition(booking.status, "in-progress", "provider");

  booking.status = "in-progress";
  booking.statusHistory.push({
    status: "in-progress",
    changedBy: providerId,
  });

  await booking.save();
  return booking;
};

/**
 * Complete booking (provider)
 */
const completeBooking = async (bookingId, providerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Not authorized", 403);
  }

  validateTransition(booking.status, "completed", "provider");

  booking.status = "completed";
  booking.statusHistory.push({
    status: "completed",
    changedBy: providerId,
  });

  await booking.save();
  return booking;
};

/**
 * Reschedule booking (customer only, requested state)
 */
const rescheduleBooking = async (
  bookingId,
  customerId,
  newDateTime
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("Not authorized", 403);
  }

  if (booking.status !== "requested") {
    throw new AppError(
      "Only requested bookings can be rescheduled",
      400
    );
  }

  if (new Date(newDateTime) <= new Date()) {
    throw new AppError("New time must be in the future", 400);
  }

  booking.scheduledDateTime = newDateTime;
  await booking.save();

  return booking;
};

module.exports = {
  createBooking,
  cancelBooking,
  acceptBooking,
  startBooking,
  completeBooking,
  rescheduleBooking,
};