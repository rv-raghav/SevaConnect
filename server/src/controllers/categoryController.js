const asyncHandler = require("../utils/asyncHandler");
const categoryService = require("../services/categoryService");

/**
 * POST /api/admin/categories
 * Create a new service category (admin only).
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, basePrice } = req.body;
  const category = await categoryService.createCategory({
    name,
    description,
    basePrice,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * PATCH /api/admin/categories/:id
 * Update a service category (admin only).
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * GET /api/categories
 * Get all active categories (public).
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllActiveCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

module.exports = { createCategory, updateCategory, getAllCategories };
