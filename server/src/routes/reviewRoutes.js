const express = require("express");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Customer submits review
router.post(
  "/reviews",
  authMiddleware,
  roleMiddleware("customer"),
  createReview
);

// Admin moderates review
router.delete(
  "/admin/reviews/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteReview
);

module.exports = router;