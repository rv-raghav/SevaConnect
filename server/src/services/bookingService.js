const Booking = require("../models/Booking");
const User = require("../models/User");
const ServiceCategory = require("../models/ServiceCategory");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const cloudinary = require("../config/cloudinary");
const { validateTransition } = require("../utils/bookingTransitions");
const logger = require("../utils/logger");

const MAX_IMAGES_PER_REQUEST = 5;

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

const uploadImageBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "seva-bookings", resource_type: "image" },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error:", error);
          reject(new AppError(`Image upload failed: ${error.message}`, 500));
          return;
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const uploadImages = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  if (files.length > MAX_IMAGES_PER_REQUEST) {
    throw new AppError("Maximum 5 images are allowed per request", 400);
  }

  const uploadedImages = [];

  try {
    for (const file of files) {
      if (!file || !file.buffer) {
        throw new AppError("Invalid image file", 400);
      }

      const result = await uploadImageBuffer(file.buffer);

      uploadedImages.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }

    return uploadedImages;
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map((image) => cloudinary.uploader.destroy(image.publicId))
    );

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to upload images. Please try again.", 500);
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

const getCustomerBookings = async (customerId, { status, page = 1, limit = 10 }) => {
  const query = { customerId };

  if (status) {
    const statuses = status.split(",").map((s) => s.trim()).filter(Boolean);
    query.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
  }

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(query)
    .populate("providerId", "name city")
    .populate("categoryId", "name basePrice")
    .sort({ scheduledDateTime: 1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  const total = await Booking.countDocuments(query);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    bookings,
  };
};

const getProviderBookings = async (providerId, { status, page = 1, limit = 10 }) => {
  const query = { providerId };

  if (status) {
    const statuses = status.split(",").map((s) => s.trim()).filter(Boolean);
    query.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
  }

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(query)
    .populate("customerId", "name city")
    .populate("categoryId", "name basePrice")
    .sort({ scheduledDateTime: 1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  const total = await Booking.countDocuments(query);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    bookings,
  };
};

const getBookingById = async (bookingId, actorId, actorRole) => {
  const booking = await Booking.findById(bookingId)
    .populate("customerId", "name")
    .populate("providerId", "name")
    .populate("categoryId", "name")
    .select("-__v");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const isCustomerOwner =
    actorRole === "customer" && booking.customerId._id.toString() === actorId;
  const isProviderOwner =
    actorRole === "provider" && booking.providerId._id.toString() === actorId;
  const isAdmin = actorRole === "admin";

  if (!isCustomerOwner && !isProviderOwner && !isAdmin) {
    throw new AppError("Not authorized to view this booking", 403);
  }

  return booking;
};

const addWorkUpdate = async ({
  bookingId,
  providerId,
  notes,
  files,
  type, // "before" or "after"
}) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Not authorized for this booking", 403);
  }

  if (!["before", "after"].includes(type)) {
    throw new AppError(
      "Query parameter 'type' must be either before or after",
      400
    );
  }

  if (type === "before" && !["confirmed", "in-progress"].includes(booking.status)) {
    throw new AppError("Before images can only be uploaded for confirmed or in-progress bookings", 400);
  }

  if (type === "after" && booking.status !== "completed") {
    throw new AppError("After images can only be uploaded once the booking is completed", 400);
  }

  const uploadedImages = await uploadImages(files || []);

  if (notes) {
    booking.workNotes = notes;
  }

  if (type === "before") {
    booking.beforeImages.push(...uploadedImages);
  }

  if (type === "after") {
    booking.afterImages.push(...uploadedImages);
  }

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
  getCustomerBookings,
  getProviderBookings,
  getBookingById,
  addWorkUpdate,
};
