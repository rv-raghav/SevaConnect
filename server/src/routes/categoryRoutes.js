const express = require("express");
const {
  createCategory,
  updateCategory,
  getAllCategories,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  mongoIdParamSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

// Public
router.get("/categories", getAllCategories);

// Admin only
router.post(
  "/admin/categories",
  authMiddleware,
  roleMiddleware("admin"),
  validateRequest({ body: createCategoryBodySchema }),
  createCategory
);

router.patch(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validateRequest({ params: mongoIdParamSchema, body: updateCategoryBodySchema }),
  updateCategory
);

module.exports = router;
