import { Router } from "express";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import subcategoryRouter from "./subcategory.router.js";
import productsRouter from "./products.router.js";
import reviewRouter from "./review.router.js";
import cartRouter from "./cart.router.js";
import orderRouter from "./order.router.js";
import couponRouter from "./coupon.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);
router.use("/product", productsRouter);
router.use("/review", reviewRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/coupon", couponRouter);

export default router;
