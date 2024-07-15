import { Router } from "express";
import * as reviewController from "../controllers/review.controller.js";
import { auth, roles } from "../middlewares/auth.js";
import { tryCatch } from "../utils/asyncHandler.js";
import fileUpload, { fileValidation } from "../middlewares/fileUpload.js";
import { validator } from "../middlewares/validation.js";
import * as validationSchemas from "../validation/review.validation.js";

const router = Router({ mergeParams: true });

export const endPoints = {
  create: [roles.User],
};

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  validator(validationSchemas.createReviews),
  tryCatch(reviewController.createReview),
);

export default router;
