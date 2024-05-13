//Fetch all users
//Fetch all transactions => Pending, succesfull, failed

const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const AppResponse = require("../helpers/AppResponse");
const User = require("../models/user.model");

module.exports.FetchAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password").select("-_id");
  
AppResponse(res, "User fetched successfully", 200, users)
})

module.exports.FetchAllTransactionsHistory = catchAsync(async (req, res, next) => {
  
})