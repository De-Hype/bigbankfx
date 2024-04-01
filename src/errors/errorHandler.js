const { sendProdError, sendDevError } = require("./EnvErrors");
const { handleValidationErrorDB, handleCastErrorDB } = require("./customErrors");
require('dotenv').config();

const GlobalErrorHandler = (err, req, res, next) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
      
      return sendDevError(err, res);
    } else{
      let error = { ...err };
      error.message = err.message;
      if (error.name === "CastError") error = handleCastErrorDB();
      if (error.name === "ValidationError") error = handleValidationErrorDB();
    //   if (error.code === 11000) error =handleDuplicateErrorDB();
      
      sendProdError(error, res);
      return;
    }
  };
  
  module.exports = GlobalErrorHandler