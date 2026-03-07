const express = require("express");
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

// ── Build allowed-origin list from env ───────────────────
const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map(normalizeOrigin).filter(Boolean)
  : [];

function isOriginAllowed(origin) {
  if (!origin || allowedOrigins.length === 0) return true;
  const normalized = normalizeOrigin(origin);
  return allowedOrigins.some((allowed) => {
    if (allowed.includes("*.")) {
      const pattern = allowed
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace("\\*\\.", "([a-z0-9-]+\\.)*");
      return new RegExp(`^${pattern}$`, "i").test(normalized);
    }
    return normalized === allowed;
  });
}

// ── CORS — applied on EVERY request (including errors) ──
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "600");
    return res.sendStatus(204);
  }
  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "1mb" }));

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
