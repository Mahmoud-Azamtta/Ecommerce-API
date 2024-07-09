import joi from "joi";

export const generalFields = {
  email: joi.string().email().messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
  }),
  password: joi.string().min(4).max(50).messages({
    "string.empty": "password is required",
  }),
  file: joi.object({
    size: joi.number().max(50000000).required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
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
