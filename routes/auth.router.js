import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { auth, roles } from "../middlewares/auth.js";
import { validator } from "../middlewares/validation.js";
import * as authSchemas from "../validation/auth.validation.js";
import { tryCatch } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/login",
  validator(authSchemas.LoginSchema),
  tryCatch(authController.login),
);

router.post(
  "/register",
  validator(authSchemas.RegisterSchema),
  tryCatch(authController.register),
);

router.get("/confirm-email/:token", tryCatch(authController.confirmEmail));

router.patch(
  "/send-code",
  validator(authSchemas.VerificationCode),
  tryCatch(authController.sendCode),
);

router.patch(
  "/reset-password",
  validator(authSchemas.ResetPassword),
  tryCatch(authController.resetPassword),
);

router.post("/add-admin", authController.addAdmin);

export default router;
