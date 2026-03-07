const express = require("express");
const {
  createOrUpdateProfile,
  getMyProfile,
  getProviders,
  getProviderById,
  getProviderStats,
} = require("../controllers/providerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { mongoIdParamSchema } = require("../validators/requestSchemas");

const router = express.Router();

// Public
router.get("/providers", getProviders);
router.get(
  "/providers/:id",
  validateRequest({ params: mongoIdParamSchema }),
  getProviderById
);

// Provider only
router.post(
  "/provider/profile",
  authMiddleware,
  roleMiddleware("provider"),
  createOrUpdateProfile
);

router.get(
  "/provider/profile",
  authMiddleware,
  roleMiddleware("provider"),
  getMyProfile
);

router.get(
  "/provider/stats",
  authMiddleware,
  roleMiddleware("provider"),
  getProviderStats
);

module.exports = router;
