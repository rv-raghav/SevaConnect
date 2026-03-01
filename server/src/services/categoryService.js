const ServiceCategory = require("../models/ServiceCategory");
const AppError = require("../utils/AppError");

/**
 * Create a new service category (admin only).
 */
const createCategory = async ({ name, description, basePrice }) => {
  if (basePrice < 0) {
    throw new AppError("Base price cannot be negative", 400);
  }

  const existing = await ServiceCategory.findOne({ name });
  if (existing) {
    throw new AppError("Category with this name already exists", 409);
  }

  const category = await ServiceCategory.create({ name, description, basePrice });
  return category;
};

/**
 * Update an existing service category (admin only).
 */
const updateCategory = async (id, updates) => {
  // If updating name, check uniqueness
  if (updates.name) {
    const existing = await ServiceCategory.findOne({
      name: updates.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new AppError("Category with this name already exists", 409);
    }
  }

  if (updates.basePrice !== undefined && updates.basePrice < 0) {
    throw new AppError("Base price cannot be negative", 400);
  }

  const category = await ServiceCategory.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

/**
 * Get all active categories (public).
 */
const getAllActiveCategories = async () => {
  const categories = await ServiceCategory.find({ isActive: true }).select("-__v");
  return categories;
};

module.exports = { createCategory, updateCategory, getAllActiveCategories };
