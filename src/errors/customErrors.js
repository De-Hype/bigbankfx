const AppError = require("./AppError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value} `;
    return new AppError(message, 503);
  };
  
  const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 503);
  };

  module.exports ={handleCastErrorDB, handleValidationErrorDB}