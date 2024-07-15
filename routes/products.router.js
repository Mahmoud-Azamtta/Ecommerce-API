import { Router } from "express";
import fileUpload, { fileValidation } from "../middlewares/fileUpload.js";
import * as productController from "../controllers/products.controller.js";
import * as validationSchemas from "../validation/products.validation.js";
import { validator } from "../middlewares/validation.js";
import { auth, roles } from "../middlewares/auth.js";
import reviewRouter from "./review.router.js";
import { tryCatch } from "../utils/asyncHandler.js";

const endPoints = {
  create: [roles.Admin],
  getAll: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
};

const router = Router();

router.use("/:productId/review", reviewRouter);

router.get("/", tryCatch(productController.getAll));

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validator(validationSchemas.CreateProduct),
  tryCatch(productController.createProduct),
);

export default router;
