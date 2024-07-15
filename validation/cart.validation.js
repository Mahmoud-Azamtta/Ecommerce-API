import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const ID = Joi.object({
  productId: generalFields.id.required(),
});

export const QuantityOperator = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  operator: Joi.string().valid("+", "-").required(),
  productId: Joi.string().hex().min(24).max(24).required(),
});
