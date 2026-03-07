const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let isOperational = err.isOperational || err instanceof AppError;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    isOperational = true;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for: ${field}`;
    isOperational = true;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    isOperational = true;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    isOperational = true;
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    isOperational = true;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds the 5MB limit";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Maximum 5 images are allowed per request";
    } else {
      message = "Invalid file upload request";
    }
  }

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON payload";
    isOperational = true;
  }

  if (!isOperational && statusCode === 500) {
    message = "Internal Server Error";
  }

  // Ensure CORS headers are present even on error responses
  const origin = req.headers.origin;
  if (origin && !res.getHeader("Access-Control-Allow-Origin")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
