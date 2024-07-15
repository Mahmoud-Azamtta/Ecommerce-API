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
  // return (req, res, next) => {
  //   const errorMessage = [];
  //   let filterData = {};
  //   if (req.file) {
  //     filterData = {
  //       image: req.file,
  //       ...req.body,
  //       ...req.query,
  //       ...req.params,
  //     };
  //   } else if (req.files) {
  //     filterData = { ...req.files, ...req.body, ...req.query, ...req.params };
  //   } else {
  //     filterData = { ...req.body, ...req.query, ...req.params };
  //   }
  //   const { error } = schema.validate(filterData, { abortEarly: false });
  //   if (error) {
  //     error.details.forEach((err) => {
  //       const key = err.context.key;
  //       errorMessage.push({ [key]: err.message });
  //     });
  //     return res
  //       .status(400)
  //       .json({ message: "valedation error", errorMessage });
  //   }
  //   next();
  // };
  return (req, res, next) => {
    const errorMessage = [];
    let filterData = {};
    if (req.file) {
      filterData = { ...req.body, ...req.params, ...req.query };
    } else if (req.files) {
      filterData = { ...req.files, ...req.body, ...req.params, ...req.query };
    } else {
      filterData = { ...req.body, ...req.params, ...req.query };
    }

    const { error } = schema.validate(filterData, { abortEarly: false });
    if (error) {
      error.details.forEach((err) => {
        const key = err.context.key;
        errorMessage.push({ [key]: err.message });
      });

      return res
        .status(400)
        .json({ message: "validation error", errors: errorMessage });
    }
    next();
  };
  // return (req, res, next) => {
  //   console.log(req.files);
  //   console.log(req.body);
  //   const inputsData = { ...req.body, ...req.params, ...req.query };
  //   if (req.file || req.files) {
  //     inputsData.file = req.file || req.files;
  //   }
  //
  //   const validationResult = schema.validate(inputsData, { abortEarly: false });
  //   if (validationResult.error?.details) {
  //     return res.status(400).json({
  //       message: "validation error",
  //       validationError: validationResult.error?.details,
  //     });
  //   }
  //
  //   next();
  // };
};
