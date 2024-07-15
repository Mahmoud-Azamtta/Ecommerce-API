import couponModel from "../models/coupon.model.js";
import AppError from "../utils/AppError.js";

export const createCoupon = async (req, res, next) => {
  const { name } = req.body;

  if (await couponModel.findOne({ name })) {
    return next(new AppError(`the coupon: ${name} already exist`, 409));
  }

  req.body.expireDate = new Date(req.body.expireDate);

  const coupon = await couponModel.create(req.body);

  return res.status(201).json({ coupon });
};
