const express = require("express");
const {
  createCategory,
  updateCategory,
  getAllCategories,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public
router.get("/categories", getAllCategories);

// Admin only
router.post(
  "/admin/categories",
  authMiddleware,
  roleMiddleware("admin"),
  createCategory
);

router.patch(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCategory
);

module.exports = router;
