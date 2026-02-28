const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Routes
app.use("/api/auth", authRoutes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;