// errorHandler.js
// Centralized error handling middleware.
// Catches errors passed via next(err) and sends a clean response instead of crashing the server.

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong. Please try again.";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;