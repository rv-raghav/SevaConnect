const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  mongoIdParamSchema,
  adminProvidersQuerySchema,
} = require("../validators/requestSchemas");
const {
  listProviders,
  approveProvider,
  rejectProvider,
  getAnalytics,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get(
  "/admin/providers",
  validateRequest({ query: adminProvidersQuerySchema }),
  listProviders
);

router.patch(
  "/admin/providers/:id/approve",
  validateRequest({ params: mongoIdParamSchema }),
  approveProvider
);

router.patch(
  "/admin/providers/:id/reject",
  validateRequest({ params: mongoIdParamSchema }),
  rejectProvider
);

router.get("/admin/analytics", getAnalytics);

module.exports = router;
