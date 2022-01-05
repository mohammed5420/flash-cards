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
  email: Joi.string().email().required().label("email"),
  password: Joi.string().required().label("password"),
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

const createFlashCardSchema = Joi.object({
  frontSide: Joi.string().required(),
  backSide: Joi.string().required(),
  colorPalette: {
    frontSide: Joi.string().required(),
    backSide: Joi.string().required()
  },
  isFavorite: Joi.boolean()
});

const updateFlashCardSchema = Joi.object({
  frontSide: Joi.string(),
  backSide: Joi.string(),
  colorPalette: {
    frontSide: Joi.string(),
    backSide: Joi.string()
  },
  isFavorite: Joi.boolean()
});

const IDSchema = Joi.object({
  _id: Joi.string().min(12).required(),
});

const favoriteCardSchema = Joi.object({
  _id: Joi.string().min(12).required(),
  isFavorite: Joi.boolean().required()
})

const updateFlashCardValidator = (requestBody) => {
  return updateFlashCardSchema.validate(requestBody);
};

const IDValidator = (requestBody) => {
  return IDSchema.validate(requestBody);
};

const signupFormValidator = (requestBody) => {
  return signupSchema.validate(requestBody);
};
const loginFormValidator = (requestBody) => {
  return loginSchema.validate(requestBody);
};

const emailValidator = (email) => {
  return emailSchema.validate(email);
};

const newPasswordValidator = (requestBody) => {
  return newPasswordSchema.validate(requestBody);
};

const resetPasswordValidator = (requestBody) => {
  return resetPasswordSchema.validate(requestBody);
};

const createFlashcardValidator = (requestBody) => {
  return createFlashCardSchema.validate(requestBody);
};

const isFavoriteCardValidator = (requestBody) => {
  return favoriteCardSchema.validate(requestBody);
}

module.exports = {
  signupFormValidator,
  loginFormValidator,
  emailValidator,
  newPasswordValidator,
  resetPasswordValidator,
  createFlashcardValidator,
  updateFlashCardValidator,
  IDValidator,
  isFavoriteCardValidator
};
