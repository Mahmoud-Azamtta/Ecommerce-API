import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import * as validationSchemas from "../validation/order.validation.js";
import { auth, roles } from "../middlewares/auth.js";
import { tryCatch } from "../utils/asyncHandler.js";
import { validator } from "../middlewares/validation.js";

const router = Router();

const endPoints = {
  create: [roles.User],
  getAll: [roles.Admin],
  userOrders: [roles.User],
  updateOrder: [roles.Admin],
};

router.post(
  "/",
  auth(endPoints.create),
  validator(validationSchemas.CreateOrder),
  tryCatch(orderController.createOrder),
);

router.get("/", auth(endPoints.getAll), tryCatch(orderController.getOrders));

router.get(
  "/user-orders",
  auth(endPoints.userOrders),
  tryCatch(orderController.getUserOrders),
);

router.patch(
  "/:orderId",
  auth(endPoints.updateOrder),
  validator(validationSchemas.UpdateStatus),
  tryCatch(orderController.changeStatus),
);
export default router;
