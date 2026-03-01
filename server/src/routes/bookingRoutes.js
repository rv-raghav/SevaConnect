const express = require("express");
const {
  createBooking,
  cancelBooking,
  acceptBooking,
  startBooking,
  completeBooking,
  rescheduleBooking,
  getMyBookings,
  getProviderBookings,
  addWorkUpdate,
} = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

/**
 * CUSTOMER ROUTES
 */
router.post(
  "/bookings",
  authMiddleware,
  roleMiddleware("customer"),
  createBooking
);

router.post(
  "/bookings/:id/work",
  authMiddleware,
  roleMiddleware("provider"),
  upload.array("images", 5),
  addWorkUpdate
);

router.patch(
  "/bookings/:id/cancel",
  authMiddleware,
  roleMiddleware("customer", "provider"),
  cancelBooking
);

router.patch(
  "/bookings/:id/reschedule",
  authMiddleware,
  roleMiddleware("customer"),
  rescheduleBooking
);

/**
 * PROVIDER ROUTES
 */
router.patch(
  "/bookings/:id/accept",
  authMiddleware,
  roleMiddleware("provider"),
  acceptBooking
);

router.patch(
  "/bookings/:id/start",
  authMiddleware,
  roleMiddleware("provider"),
  startBooking
);

router.patch(
  "/bookings/:id/complete",
  authMiddleware,
  roleMiddleware("provider"),
  completeBooking
);

router.get(
  "/bookings/my",
  authMiddleware,
  roleMiddleware("customer"),
  getMyBookings
);

router.get(
  "/provider/bookings",
  authMiddleware,
  roleMiddleware("provider"),
  getProviderBookings
);

module.exports = router;