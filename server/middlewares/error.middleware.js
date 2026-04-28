const errorMiddleware = (err, req, res, next) => {
  console.error("Global Error:", err.message);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);

    return res.status(400).json({
      success: false,
      errors: messages,
    });
  }

  const status = err.statusCode || 500;

  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
