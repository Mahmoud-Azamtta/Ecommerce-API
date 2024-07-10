import slugify from "slugify";
import categoryModel from "../models/category.model.js";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";
import { pagination } from "../utils/pagination.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;

  if (await categoryModel.findOne({ name: name.toLowerCase() })) {
    next(new AppError("Category already exists", 409));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/categories`,
    },
  );

  const category = await categoryModel.create({
    name: name.toLowerCase(),
    slug: slugify(name),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return res.status(201).json({ message: "success", category });
};

export const getAll = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const categories = await categoryModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "createdBy",
        select: "username",
      },
      {
        path: "updatedBy",
        select: "username",
      },
      { path: "subcategory" },
    ]);

  return res.status(200).json({ message: "success", categories });
};

export const getActive = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const categories = await categoryModel
    .find({ status: "Active" })
    .limit(limit)
    .skip(skip)
    .select("name image");

  return res.status(200).json({ message: "success", categories });
};

export const getById = async (req, res, next) => {
  const category = await categoryModel
    .findById(req.params.id)
    .select("-createdBy -updatedBy")
    .populate({ path: "subcategory", select: "name image" });
  if (!category) {
    return next(new AppError("category not found", 404));
  }
  return res.status(200).json({ message: "success", category });
};

export const updateCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(new AppError("category not found", 404));
  }

  if (req.body.name) {
    if (
      await categoryModel.findOne({
        name: req.body.name.toLowerCase(),
        _id: { $ne: req.params.id },
      })
    ) {
      return next(
        new AppError(`category ${req.body.name} already exists`, 409),
      );
    }

    category.name = req.body.name.toLowerCase();
    category.slug = slugify(category.name);
  }

  if (req.body.status) {
    category.status = req.body.status;
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/categories`,
      },
    );
    await cloudinary.uploader.destroy(category.image.public_id);

    category.image = { secure_url, public_id };
  }

  category.updatedBy = req.user._id;
  await category.save();

  return res.json({ message: "success", category });
};

export const deleteCategory = async (req, res, next) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("category not found", 404));
  }

  await cloudinary.uploader.destroy(category.image.public_id);

  return res.status(200).json({ message: "success", category });
};
