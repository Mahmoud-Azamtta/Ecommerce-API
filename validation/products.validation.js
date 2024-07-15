import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const CreateProduct = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  description: Joi.string(),
  stock: Joi.number().min(0).default(1),
  price: Joi.number().required(),
  discount: Joi.number().min(0).max(100),
  categoryId: Joi.string().min(24).max(24),
  subcategoryId: Joi.string().min(24).max(24),
  mainImage: Joi.array().items(generalFields.file).required(),
  subImages: Joi.array().items(generalFields.file).max(4).optional(),
  sizes: Joi.array()
    .items(Joi.string().valid("s", "m", "lg", "xl"))
    .optional(),
});
