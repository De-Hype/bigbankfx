const bcrypt = require("bcryptjs")
const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const { ValidateSignUp } = require("../helpers/formValidation");
const GeneratePublicId = require("../helpers/GeneratePublicId");
const AppResponse = require("../helpers/AppResponse");
const User = require("../models/user.model");
console.log(GeneratePublicId()) 

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
        return next(new AppError("User seems to already exist",401 ));
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(value.password,salt);
     const publicId = GeneratePublicId(123);
    const newUser = new User({
        publicId:publicId,
        first_name:value.first_name,
        last_name:value.last_name,
        username:value.username,
        email:value.email,
        password:hashedPassword,
        plan:"basic"
        // total_balance:{
        //     type:Number,
        // },
        // prev_deposit:{
        //     type:Number,
        // },
        // new_deposit:{
        //     type:Number,
        // },
        // profit:{
        //     type:Number,
        // }
    })
    await newUser.save();
    AppResponse(res,"User created successfully", 201, newUser)


})
module.exports.SignIn = catchAsync(async (req, res, next) => {
    

})