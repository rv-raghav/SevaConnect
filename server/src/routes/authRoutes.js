const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
    registerBodySchema,
    loginBodySchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/register", validateRequest({ body: registerBodySchema }), register);
router.post("/login", validateRequest({ body: loginBodySchema }), login);
router.get("/me", authMiddleware, getMe);

module.exports = router;