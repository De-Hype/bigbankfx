const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const { ValidateSignUp } = require("../helpers/formValidation");
const User = require("../models/user.model");

module.exports.SignUp = catchAsync(async (req, res, next) => {
    const {value, error} = ValidateSignUp(req.body);
    if (error){
        return next(new AppError(error.message, 400))
    }
    if(value.password !== value.confirm_password){
        return next(new AppError("Passwords do not match", 401))
    };
    const findUser = await User.findOne({email:value.email});
    if(findUser){
        return next(new AppError("User already exist",401 ));
    }

})
module.exports.SignIn = catchAsync(async (req, res, next) => {
    

})