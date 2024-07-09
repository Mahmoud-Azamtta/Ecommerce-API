import AppError from "./AppError.js";

export const tryCatch = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(new AppError(error.stack, 500));
    }
  };
};
