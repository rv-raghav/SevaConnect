const express = require("express");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  createReviewBodySchema,
  mongoIdParamSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

// Customer submits review
router.post(
  "/reviews",
  authMiddleware,
  roleMiddleware("customer"),
  validateRequest({ body: createReviewBodySchema }),
  createReview
);

// Admin moderates review
router.delete(
  "/admin/reviews/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validateRequest({ params: mongoIdParamSchema }),
  deleteReview
);

module.exports = router;
