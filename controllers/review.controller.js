import orderModel from "../models/order.model.js";
import reviewModel from "../models/review.model.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../utils/cloudinary.js";

export const createReview = async (req, res, next) => {
  const { comment, rating, productId } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });

  if (!order) {
    return next(new AppError("product not ordered before", 400));
  }

  const oldReview = await reviewModel.findOne({
    userId: req.user._id,
    productId: productId,
  });
  if (oldReview) {
    return next(new AppError("already reviewed this product ", 400));
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/${productId}/reviews` },
    );
    req.body.image = { secure_url, public_id };
  }

  const review = await reviewModel.create({
    comment,
    rating,
    productId,
    userId: req.user._id,
    image: req.body.image,
  });

  return res.status(200).json({ review });
};
