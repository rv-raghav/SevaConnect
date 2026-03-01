const express = require("express");
const {
  createOrUpdateProfile,
  getMyProfile,
  getProviders,
} = require("../controllers/providerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public
router.get("/providers", getProviders);

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

module.exports = router;
