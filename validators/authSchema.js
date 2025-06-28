// validators/authSchema.js
import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username should have at least 3 characters",
  }),

  email: Joi.string()
    .email({ tlds: false })
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.email": "Email must be a valid Gmail address",
      "string.pattern.base": "Only @gmail.com emails are allowed",
      "string.empty": "Email is required",
    }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
  }),
});



export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: false })
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.email": "Email must be a valid Gmail address",
      "string.pattern.base": "Only @gmail.com emails are allowed",
      "string.empty": "Email is required",
    }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
  }),
});