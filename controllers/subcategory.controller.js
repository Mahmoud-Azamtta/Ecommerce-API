import slugify from "slugify";
import categoryModel from "../models/category.model.js";
import cloudinary from "../utils/cloudinary.js";
import subcategoryModel from "../models/subcategory.model.js";
import { pagination } from "../utils/pagination.js";
import AppError from "../utils/AppError.js";

export const createSubcategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const { categoryId } = req.body;
  const subcategory = await subcategoryModel.findOne({ name });

  if (subcategory) {
    return next(new AppError(`sub category ${name} already exists`, 409));
  }

  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return next(new AppError(`category not found`, 404));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/subcategories`,
    },
  );

  const subCategory = await subcategoryModel.create({
    name,
    slug: slugify(name),
    categoryId,
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return res.status(201).json({ message: "success", subCategory });
};

export const getAll = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  if (!req.params.categoryId) {
    const subcategories = await subcategoryModel.find();
    return res
      .status(200)
      .json({ message: "success", count: subcategories.length, subcategories });
  }

  const { categoryId } = req.params;
  const category = await categoryModel
    .findById(categoryId)
    .skip(skip)
    .limit(limit);

  if (!category) {
    return next(new AppError(`category not found`, 404));
  }

  const subcategories = await subcategoryModel.find({ categoryId }).populate({
    path: "categoryId",
  });

  return res
    .status(200)
    .json({ message: "success", count: subcategories.length, subcategories });
};

export const getActive = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  if (!req.params.categoryId) {
    const subcategories = await subcategoryModel
      .find({ status: "Active" })
      .skip(skip)
      .limit(limit)
      .select("name image");

    return res
      .status(200)
      .json({ message: "success", count: subcategories.length, subcategories });
  }

  const { categoryId } = req.params;
  const subcategories = await subcategoryModel
    .find({ categoryId, status: "Active" })
    .skip(skip)
    .limit(limit)
    .select("name image");

  if (!subcategories) {
    return next(new AppError(`subcategory not found`, 404));
  }

  return res
    .status(200)
    .json({ message: "success", count: subcategories.length, subcategories });
};

export const getById = async (req, res, next) => {
  const subCategory = await subcategoryModel
    .findById(req.params.id)
    .select("-createdBy -updatedBy");
  if (!subCategory) {
    return next(new AppError(`subcategory not found`, 404));
  }

  return res.status(200).json({ subCategory });
};

export const updateSubcategory = async (req, res, next) => {
  const sub = await subcategoryModel.findById(req.params.id);
  if (!sub) {
    return next(
      new AppError(`subcategory for id: ${req.params.id} is not found`, 404),
    );
  }

  if (req.body.name) {
    if (
      await subcategoryModel.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      })
    ) {
      return next(
        new AppError(`subcategory ${req.body.name} already exists`, 409),
      );
    }

    sub.name = req.body.name.toLowerCase();
    sub.slug = slugify(sub.name);
  }

  if (req.body.status) {
    sub.status = req.body.status;
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/subcategories` },
    );
    await cloudinary.uploader.destroy(sub.image.public_id);
    sub.image = { secure_url, public_id };
  }

  sub.updatedBy = req.user._id;
  await sub.save();

  return res.status(200).json({ message: "success" });
};

export const deleteSubcategory = async (req, res, next) => {
  const sub = await subcategoryModel.findByIdAndDelete(req.params.id);
  if (!sub) {
    return next(new AppError(`subcategroy not found`, 404));
  }

  await cloudinary.uploader.destroy(sub.image.public_id);

  return res.status(200).json({ message: "success" });
};
