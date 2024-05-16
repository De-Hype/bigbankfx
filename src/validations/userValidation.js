const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const UpdateUserPlan = Joi.object({
  email: Joi.string().email().required().label("Email"),
  plan: Joi.string().min(4).max(6).required().valid("basic", "silver", "gold"),
  password: Joi.string().min(6).max(30).required().label("Password"),
});

const DeleteUser = Joi.object({
  email: Joi.string().email().required().label("Email")
})

exports.ValidateUpdatePlan = validator(UpdateUserPlan);
exports.ValidateDeleteUser = validator(DeleteUser);
