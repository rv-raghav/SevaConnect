const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const providerRoutes = require("./routes/providerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { authRateLimiter } = require("./middlewares/rateLimiters");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    const isAllowed = allowedOrigins.includes(normalizeOrigin(origin));
    callback(null, isAllowed);
  },
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "sevaconnect-api",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/ready", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const payload = {
    success: dbConnected,
    status: dbConnected ? "ready" : "not_ready",
    checks: {
      database: dbConnected ? "up" : "down",
    },
    timestamp: new Date().toISOString(),
  };

  res.status(dbConnected ? 200 : 503).json(payload);
});

// Routes
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", providerRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);
app.use("/api", adminRoutes);

app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
