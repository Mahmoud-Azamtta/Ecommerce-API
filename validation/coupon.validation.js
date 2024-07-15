import Joi from "joi";

export const CreateCoupon = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  amount: Joi.number().positive(),
  expireDate: Joi.date().greater("now").required(),
});
