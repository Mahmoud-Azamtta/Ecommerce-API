import { Router } from "express";
import { auth, roles } from "../middlewares/auth.js";
import * as cartController from "../controllers/cart.controller.js";
import * as validationSchemas from "../validation/cart.validation.js";
import { tryCatch } from "../utils/asyncHandler.js";
import { validator } from "../middlewares/validation.js";

const router = Router();

const endPoints = {
  create: [roles.User],
  delete: [roles.User],
  clear: [roles.User],
  get: [roles.User],
  update: [roles.User],
};

router.get("/", auth(endPoints.get), tryCatch(cartController.getCart));

router.post(
  "/",
  auth(endPoints.create),
  validator(validationSchemas.ID),
  tryCatch(cartController.addToCart),
);

router.put(
  "/clear-cart",
  auth(endPoints.clear),
  tryCatch(cartController.clearCart),
);

router.put(
  "/:productId",
  auth(endPoints.delete),
  validator(validationSchemas.ID),
  tryCatch(cartController.removeFromCart),
);

router.put(
  "/update-quantity/:productId",
  auth(endPoints.update),
  validator(validationSchemas.QuantityOperator),
  tryCatch(cartController.updateQuantity),
);

export default router;
