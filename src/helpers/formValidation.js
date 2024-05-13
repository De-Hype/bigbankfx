const Joi = require('joi');

const validator =(schema)=>(payload)=> schema.validate(payload, {abortEarly:false});


const SignUpSchema = Joi.object({
    first_name:Joi.string().min(4).required().label("First Name"),
    last_name:Joi.string().min(4).required().label("Last Name"),
    username:Joi.string().min(7).required().label("Username"),
    email:Joi.string().email().required().label("Email"),
    password:Joi.string().min(6).max(30).required().label("Password"),
    confirm_password:Joi.string().min(6).max(30).required().label("Confirm Password"),
})

const SignInSchema = Joi.object({
    email:Joi.string().email().required().label("Email"),
    password:Joi.string().min(6).max(30).required().label("Password"),
    rememberMe:Joi.boolean()
});
const MakePaymentSchema = Joi.object({
    email:Joi.string().email().required().label("Email"),
    amount:Joi.number().required().label("Amount")
})


exports.ValidateSignUp= validator(SignUpSchema);
exports.ValidateSignIn = validator(SignInSchema);
exports.ValidateInitializePayment=validator(MakePaymentSchema);
