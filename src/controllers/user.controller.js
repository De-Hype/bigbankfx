//Fetch User Details
//Fetch User Transaction History => Pending, succesfull, failed
//Calculate user profit
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const { ValidateUpdatePlan } = require("../validations/userValidation");
const GeneratePublicId = require("../helpers/GeneratePublicId");
const AppResponse = require("../helpers/AppResponse");
const User = require("../models/user.model");
const GenerateToken = require("../helpers/GenerateToken");
require("dotenv").config();

//Change User Plan
module.exports.UpdatePlan = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateUpdatePlan(req.body);
  if (error) return next(new AppError(error.message, 400));
  const { publicId, plan } = req.user;
  //We have to check if this is the s
  const findUser = await User.findOne({ publicId: publicId });
  if (!findUser) return next(new AppError("User does not exist", 404));
  if (findUser.email !== value.email)
    return next(
      new AppError(
        "Suspicious activity detected. Sorry, you can not change this role",
        404
      )
    );
  const isPasswordValid = await bcrypt.compare(
    value.password,
    findUser.password
  );
  if (!isPasswordValid)
    return next(
      new AppError("Incorrect details provided, cannot change role", 400)
    );
  if (findUser.plan == value.plan)
    return next(
      new AppError("Sorry, you can not change to the same role", 400)
    );
  const updatedUser = await User.findOneAndUpdate(
    { publicId: publicId },
    { plan: value.plan }
  ).select("-password");
  let account = {
    publicId: updatedUser.publicId,
    first_name: updatedUser.first_name,
    last_name: updatedUser.last_name,
    username: updatedUser.username,
    email: updatedUser.email,
    plan: updatedUser.plan,
  };
  const token = GenerateToken(
    account,
    process.env.LOGIN_JWT_TOKEN,
    value.rememberMe
  );
  account = { ...account, token: token };

  return AppResponse(res, "Plan updated successfully", 200, account);
});
