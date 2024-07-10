import Joi from "joi";

export const generalFields = {
  email: Joi.string().email().messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
  }),
  password: Joi.string().min(4).max(50).messages({
    "string.empty": "password is required",
  }),
  file: Joi.object({
    size: Joi.number().max(50000000).required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
    dest: Joi.string(),
  }),
  id: Joi.string().hex().length(24),
};

export const validator = (schema) => {
  return (req, res, next) => {
    const inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }

    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "validation error",
        validationError: validationResult.error?.details,
      });
    }

    next();
  };
};
