//Fetch all users
//Fetch all transactions => Pending, succesfull, failed

const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const AppResponse = require("../helpers/AppResponse");
const User = require("../models/user.model");


module.exports.AdminSignUp = catchAsync(async (req, res, next) => {
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
module.exports.AdminSignIn = catchAsync(async (req, res, next) => {
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
  const token = GenerateToken(
    account,
    process.env.LOGIN_JWT_TOKEN,
    value.rememberMe
  );
  account = { ...account, token: token };
  return AppResponse(res, "User logged in successfully", 200, account);
});

module.exports.FetchAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password").select("-_id");
  
AppResponse(res, "User fetched successfully", 200, users)
})

// module.exports.FetchAllTransactionsHistory = catchAsync(async (req, res, next) => {
  
// })
