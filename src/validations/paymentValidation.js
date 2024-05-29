const Joi = require('joi');

const validator =(schema)=>(payload)=> schema.validate(payload, {abortEarly:false});
const MakePaymentSchema = Joi.object({
    publicId:Joi.string().required().label('Public Id'),
    email:Joi.string().email().required().label("Email"),
    amount:Joi.number().required().label("Amount"),
})

exports.ValidateInitializePayment=validator(MakePaymentSchema);
