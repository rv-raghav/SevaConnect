const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    bio: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: [0, "Experience years cannot be negative"],
    },
    availabilityStatus: {
      type: String,
      enum: {
        values: ["available", "unavailable"],
        message: "Availability must be available or unavailable",
      },
      default: "available",
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for query performance
providerProfileSchema.index({ categories: 1 });
providerProfileSchema.index({ availabilityStatus: 1 });

const ProviderProfile = mongoose.model("ProviderProfile", providerProfileSchema);

module.exports = ProviderProfile;
