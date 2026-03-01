const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    scheduledDateTime: {
      type: Date,
      required: [true, "Scheduled date/time is required"],
    },

    priceSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },

    notes: {
      type: String,
      trim: true,
    },

    cancelledBy: {
      type: String,
      enum: ["customer", "provider"],
    },

    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance
bookingSchema.index({ providerId: 1, scheduledDateTime: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;