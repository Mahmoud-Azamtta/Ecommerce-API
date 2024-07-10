import Joi from "joi";
import { generalFields } from "../middlewares/validation.js";

export const CreateSub = Joi.object({
  name: Joi.string().min(4).max(50).required(),
  categoryId: generalFields.id.required(),
  file: generalFields.file,
});

export const ID = Joi.object({
  id: generalFields.id.required(),
});

export const UpdateSub = Joi.object({
  name: Joi.string().min(4).max(50),
  status: Joi.string().valid("Active", "Inactive").default("Active"),
  file: generalFields.file,
  id: generalFields.id,
});
