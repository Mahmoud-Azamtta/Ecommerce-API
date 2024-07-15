import { Router } from "express";
import { auth, roles } from "../middlewares/auth.js";
import * as couponController from "../controllers/coupon.controller.js";
import * as validationSchemas from "../validation/coupon.validation.js";
import { tryCatch } from "../utils/asyncHandler.js";
import { validator } from "../middlewares/validation.js";

const router = Router();

const endPoints = {
  create: [roles.Admin],
};

router.post(
  "/",
  auth(endPoints.create),
  validator(validationSchemas.CreateCoupon),
  tryCatch(couponController.createCoupon),
);

export default router;
