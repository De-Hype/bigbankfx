const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const {
  ValidateSignUp,
  ValidateSignIn,
} = require("../validations/authValidation");
const GeneratePublicId = require("../helpers/GeneratePublicId");
const AppResponse = require("../helpers/AppResponse");
const User = require("../models/user.model");
const {
  GenerateAccessToken,
  GenerateRefreshToken,
} = require("../helpers/GenerateToken");
require("dotenv").config();

module.exports.SignUp = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateSignUp(req.body);
  if (error) return next(new AppError(error.message, 400));

  if (value.password !== value.confirm_password)
    return next(new AppError("Passwords do not match", 401));

  const findUser = await User.findOne({ email: value.email });
  if (findUser) return next(new AppError("User seems to already exist", 401));

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(value.password, salt);
  const publicId = GeneratePublicId(123);
  const newUser = new User({
    publicId: publicId,
    first_name: value.first_name,
    last_name: value.last_name,
    username: value.username,
    email: value.email,
    password: hashedPassword,
    plan: "basic",
  });
  await newUser.save();
  const account = {
    publicId: publicId,
    first_name: value.first_name,
    last_name: value.last_name,
    username: value.username,
    email: value.email,
    plan: "basic",
  };

  AppResponse(res, "User created successfully", 202, account);
});
module.exports.SignIn = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateSignIn(req.body);
  if (error) return next(new AppError(error.message, 400));

  const findUser = await User.findOne({ email: value.email });
  if (!findUser) return next(new AppError("User does not exist", 404));

  const isPasswordValid = await bcrypt.compare(
    value.password,
    findUser.password
  );
  if (!isPasswordValid) return next(new AppError("Invalid login details", 400));

  let account = {
    publicId: findUser.publicId,
    first_name: findUser.first_name,
    last_name: findUser.last_name,
    username: findUser.username,
    email: findUser.email,
    plan: findUser.plan,
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

module.exports.GetNewAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.big_bank_fx_refresh_token;
  // console.log(refreshToken);
  if (!refreshToken) {
    return next(new AppError("Invalid token, Unauthorized", 401));
  }
  jwt.verify(refreshToken, process.env.LOGIN_JWT_TOKEN, async (err, decoded) => {
    if (err) {
      return next(
        new AppError("Incorrect or expired token, please log in", 401)
      );
    }
    req.user = decoded;

    const findUser = await User.findOne({ publicId: req.user.payload.publicId });
    if (!findUser) {
      return next(
        new AppError("User does not exist, can not create access token", 401)
      );
    }
    const account = {
      publicId: findUser.publicId,
      first_name: findUser.first_name,
      last_name: findUser.last_name,
      username: findUser.username,
      email: findUser.email,
      plan: findUser.plan,
    };
    const access_token = GenerateAccessToken(
      account,
      process.env.JWT_ACCESS_TOKEN_CREATE
    );
    
    res.cookie("big_bank_fx_access_token", access_token, {
      ...res.CookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000),
      maxAge: new Date(Date.now() + 15 * 60 * 1000),
    });
    return AppResponse(res, "Access token refreshed succesfully", 200, account);
    // next();
  });
});
