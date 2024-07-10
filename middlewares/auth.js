import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return async (req, _, next) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER)) {
      return next(
        new AppError("Unauthorized, invlaid authorization token", 401),
      );
    }

    const token = authorization.split(process.env.BEARER)[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    } catch (error) {
      return next(new AppError("Token has expired, login again", 400));
    }

    if (!decoded) {
      return next(
        new AppError("Unauthorized, invalid authorization token", 401),
      );
    }

    const user = await userModel
      .findById(decoded.id)
      .select("username role changePasswordTime");

    if (!user) {
      return next(new AppError("User not found", 400));
    }

    if (Number(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
      return next(new AppError("Token has expired, login again", 400));
    }

    if (!accessRoles.includes(user.role)) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = user;
    next();
  };
};
