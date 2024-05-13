const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const UpdateUserPlan = Joi.object({
  email: Joi.string().email().required().label("Email"),
  plan: Joi.string().min(4).max(6).required().allow("basic", "silver", "gold"),
  password: Joi.string().min(6).max(30).required().label("Password"),
});

exports.ValidateUpdatePlan = validator(UpdateUserPlan);
