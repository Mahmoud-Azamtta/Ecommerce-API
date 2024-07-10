import { Router } from "express";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import subcategoryRouter from "./subcategory.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);

export default router;
