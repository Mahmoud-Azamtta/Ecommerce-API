import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const CreateCategory = Joi.object({
  name: Joi.string().min(4).max(50).required(),
  file: generalFields.file,
});

export const ID = Joi.object({
  id: generalFields.id.required(),
});

export const UpdateCategory = Joi.object({
  name: Joi.string().min(4).max(50),
  status: Joi.string().valid("Active", "Inactive").default("Active"),
  id: generalFields.id,
  file: generalFields.file.optional(),
});
