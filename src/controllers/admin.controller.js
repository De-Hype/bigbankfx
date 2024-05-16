//Fetch all users
//Fetch all transactions => Pending, succesfull, failed
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const AppResponse = require("../helpers/AppResponse");
const Admin = require("../models/admin.model");
const {
  ValidateAdminSignUp,
  ValidateAdminSignIn,
} = require("../validations/adminValidation");
const GeneratePublicId = require("../helpers/GeneratePublicId");
const {
  GenerateAccessToken,
  GenerateRefreshToken,
} = require("../helpers/GenerateToken");

module.exports.AdminSignUp = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateAdminSignUp(req.body);
  if (error) return next(new AppError(error.message, 400));

  const findUser = await Admin.findOne({ email: value.email });
  if (findUser) return next(new AppError("User seems to already exist", 401));

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(value.password, salt);
  const publicId = GeneratePublicId(123);
  const newUser = new Admin({
    publicId: publicId,
    first_name: value.first_name,
    last_name: value.last_name,
    username: value.username,
    email: value.email,
    password: hashedPassword,
    role: "admin",
  });
  await newUser.save();
  const account = {
    publicId: publicId,
    first_name: value.first_name,
    last_name: value.last_name,
    username: value.username,
    email: value.email,
    role: "admin",
  };

  AppResponse(res, "Admin account created successfully", 202, account);
});
module.exports.AdminSignIn = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateAdminSignIn(req.body);
  if (error) return next(new AppError(error.message, 400));

  const findUser = await Admin.findOne({ email: value.email });
  if (!findUser) return next(new AppError("User does not exist", 404));

  const isPasswordValid = await bcrypt.compare(
    value.password,
    findUser.password
  );
  if (!isPasswordValid) return next(new AppError("Invalid login details", 400));

  const account = {
    publicId: findUser.publicId,
    first_name: findUser.first_name,
    last_name: findUser.last_name,
    username: findUser.username,
    email: findUser.email,
    role: findUser.role,
  };
  const access_token = GenerateAccessToken(
    account,
    process.env.JWT_ACCESS_TOKEN_CREATE
  );
  const refresh_token = GenerateRefreshToken(
    account,
    process.env.LOGIN_JWT_TOKEN,
    value.rememberMe
  );
  res.cookie("big_bank_fx_access_token", access_token, {
    ...res.CookieOptions,
    expires: new Date(Date.now() + 15 * 60 * 1000),
    maxAge: new Date(Date.now() + 15 * 60 * 1000),
  });
  res.cookie("big_bank_fx_refresh_token", refresh_token, {
    ...res.CookieOptions,
    expires: new Date(Date.now() + 86400000),
    maxAge: new Date(Date.now() + 86400000),
  });

  return AppResponse(res, "User logged in successfully", 200, account);
});

module.exports.FetchAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password").select("-_id");

  AppResponse(res, "User fetched successfully", 200, users);
});

// module.exports.FetchAllTransactionsHistory = catchAsync(async (req, res, next) => {

// })
