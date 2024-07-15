import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const createReviews = Joi.object({
  comment: Joi.string().min(3).max(100).required(),
  rating: Joi.number().min(1).max(5).required(),
  productId: generalFields.id.required(),
  file: generalFields.file,
});
