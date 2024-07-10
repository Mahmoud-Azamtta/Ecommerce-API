import { Router } from "express";
import * as subcategoryController from "../controllers/subcategory.controller.js";
import fileUpload, { fileValidation } from "../middlewares/fileUpload.js";
import { validator } from "../middlewares/validation.js";
import { auth, roles } from "../middlewares/auth.js";
import { tryCatch } from "../utils/asyncHandler.js";
import * as validationSchemas from "../validation/subcategory.validation.js";

const router = Router({ mergeParams: true });

const endPoint = {
  create: [roles.Admin],
  getAll: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
};

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validator(validationSchemas.CreateSub),
  tryCatch(subcategoryController.createSubcategory),
);

router.get("/", auth(endPoint.getAll), tryCatch(subcategoryController.getAll));

router.get("/get-active", tryCatch(subcategoryController.getActive));

router.get(
  "/get/:id",
  validator(validationSchemas.ID),
  tryCatch(subcategoryController.getById),
);

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  validator(validationSchemas.UpdateSub),
  tryCatch(subcategoryController.updateSubcategory),
);

router.delete(
  "/:id",
  auth(endPoint.delete),
  validator(validationSchemas.ID),
  tryCatch(subcategoryController.deleteSubcategory),
);

export default router;
