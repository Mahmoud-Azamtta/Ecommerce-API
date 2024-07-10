import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import subcategoryRouter from "./subcategory.router.js";
import fileUpload, { fileValidation } from "../middlewares/fileUpload.js";
import { auth, roles } from "../middlewares/auth.js";
import { validator } from "../middlewares/validation.js";
import { tryCatch } from "../utils/asyncHandler.js";
import * as validationSchemas from "../validation/category.validation.js";

const router = Router();

const endPoints = {
  create: [roles.Admin],
  getAll: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
};

router.use("/:categoryId/subcategory", subcategoryRouter);

router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  validator(validationSchemas.CreateCategory),
  auth(endPoints.create),
  tryCatch(categoryController.createCategory),
);

router.get("/", auth(endPoints.get), tryCatch(categoryController.getAll));

router.get("/get-active", tryCatch(categoryController.getActive));

router.get(
  "/:id",
  validator(validationSchemas.ID),
  tryCatch(categoryController.getById),
);

router.patch(
  "/:id",
  fileUpload(fileValidation.image).single("image"),
  validator(validationSchemas.UpdateCategory),
  auth(endPoints.update),
  tryCatch(categoryController.updateCategory),
);

router.delete(
  "/:id",
  validator(validationSchemas.ID),
  auth(endPoints.delete),
  tryCatch(categoryController.deleteCategory),
);

export default router;
