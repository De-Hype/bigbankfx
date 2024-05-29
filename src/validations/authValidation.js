const Joi = require('joi');

const validator =(schema)=>(payload)=> schema.validate(payload, {abortEarly:false});

const SignUpSchema = Joi.object({
    first_name:Joi.string().min(3).required().label("First Name"),
    last_name:Joi.string().min(3).required().label("Last Name"),
    username:Joi.string().min(5).required().label("Username"),
    email:Joi.string().email().required().label("Email"),
    password:Joi.string().min(6).max(30).required().label("Password"),
    confirm_password:Joi.string().min(6).max(30).required().label("Confirm Password"),
})

const SignInSchema = Joi.object({
    email:Joi.string().email().required().label("Email"),
    password:Joi.string().min(6).max(30).required().label("Password"),
    rememberMe:Joi.boolean()
});
const UpdateUserSchema=Joi.object({
    email:Joi.string().email().required().label("Email"),
    password:Joi.string().min(6).max(30).required().label("Password"),
});



exports.ValidateSignUp= validator(SignUpSchema);
exports.ValidateSignIn = validator(SignInSchema);
