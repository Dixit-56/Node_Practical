const Joi = require("joi");

const registerUser = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const loginUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = user = {
  registerUser,
  loginUser,
};
