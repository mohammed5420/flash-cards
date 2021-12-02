const Joi = require("joi").extend(require("@joi/date"));
const signupSchema = Joi.object({
  userName: Joi.string().max(200).required().label("user name"),
  email: Joi.string().email().required().label("email"),
  password: Joi.string().min(6).required().label("password"),
  confirmPassword: Joi.valid(Joi.ref("password")).messages({
    "any.only": "Password confirmation does not match",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().label("email").messages({
    "string.base": `email should be a type of 'text'`,
    "string.empty": `please enter your email`,
    "string.email": `email is not valid email`,
    "any.required": `email is a required field`,
  }),
  password: Joi.string().required().label("password").messages({
    "string.base": `password should be a type of 'text'`,
    "string.empty": `please enter your password`,
    "any.required": `password is a required field`,
  }),
  remeber_me: Joi.string(),
});

const emailSchema = Joi.string().email().required().label("email").messages({
  "string.base": `email should be a type of 'text'`,
  "string.empty": `please enter your email`,
  "string.email": `email is not valid email`,
  "any.required": `email is a required field`,
});

const newPasswordSchema = Joi.object({
  old_password: Joi.string().min(6).required().label("old password").messages({
    "string.base": `password should be a type of 'text'`,
    "string.empty": `please enter your old password`,
    "string.min": `use at least {#limit} characters`,
    "string.max": `password should have a maximum length of {#limit}`,
    "any.required": `password is a required field`,
  }),
  new_password: Joi.string().min(6).required().label("new password").messages({
    "string.base": `password should be a type of 'text'`,
    "string.empty": `please enter your new password`,
    "string.min": `use at least {#limit} characters`,
    "string.max": `password should have a maximum length of {#limit}`,
    "any.required": `password is a required field`,
  }),
  confirm_password: Joi.ref("new_password"),
});

const resetPasswordSchema = Joi.object({
  new_password: Joi.string().min(6).required().label("new password").messages({
    "string.base": `password should be a type of 'text'`,
    "string.empty": `please enter your new password`,
    "string.min": `use at least {#limit} characters`,
    "string.max": `password should have a maximum length of {#limit}`,
    "any.required": `password is a required field`,
  }),
  confirm_password: Joi.ref("new_password"),
});

const singupFormValidatior = (formData) => {
  return signupSchema.validate(formData);
};
const loginFormValidator = (formData) => {
  return loginSchema.validate(formData);
};

const emailValidator = (email) => {
  return emailSchema.validate(email);
};

const newPasswordValidator = (formData) => {
  return newPasswordSchema.validate(formData);
};

const resetPasswordValidator = (formData) => {
  return resetPasswordSchema.validate(formData);
};

module.exports = {
  singupFormValidatior,
  loginFormValidator,
  emailValidator,
  newPasswordValidator,
  resetPasswordValidator,
};
