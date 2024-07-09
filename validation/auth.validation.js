import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const LoginSchema = Joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
});

export const RegisterSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669]+$"))
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.empty": "username is required",
    }),
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  checkPassword: Joi.valid(Joi.ref("password")).required(),
});

export const VerificationCode = Joi.object({
  email: generalFields.email.required(),
});

export const ResetPassword = Joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  checkPassword: Joi.valid(Joi.ref("password")).required(),
  code: Joi.string().length(4).required(),
});
