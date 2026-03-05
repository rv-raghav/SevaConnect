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

const allowedOriginMatchers = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
      .map((origin) => {
        if (origin.includes("*.")) {
          const wildcardPattern = origin
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace("\\*\\.", "([a-z0-9-]+\\.)*");
          const wildcardRegex = new RegExp(`^${wildcardPattern}$`, "i");
          return (candidate) => wildcardRegex.test(candidate);
        }
        return (candidate) => candidate === origin;
      })
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOriginMatchers.length === 0) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed = allowedOriginMatchers.some((match) =>
      match(normalizedOrigin)
    );
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ── CORS ────────────────────────────────────────────────
// Explicit preflight handler — must come before everything else.
// The cors() middleware alone doesn't reliably set Allow-Methods on OPTIONS.
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // cache preflight for 24h
  return res.sendStatus(204);
});

app.use(cors(corsOptions));
app.use(helmet());
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
