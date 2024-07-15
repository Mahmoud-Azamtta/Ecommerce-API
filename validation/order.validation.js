import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const UpdateStatus = Joi.object({
  status: Joi.string().valid(
    "pending",
    "cancelled",
    "confirmed",
    "onWay",
    "delivered",
  ),
  orderId: generalFields.id,
});

export const CreateOrder = Joi.object({
  address: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().length(10).required(),
  couponName: Joi.string().min(3).max(25),
});
