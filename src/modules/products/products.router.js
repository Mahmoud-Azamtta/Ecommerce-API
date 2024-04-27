import { Router } from "express";
import * as controller from "./products.controller.js";

const router = Router({ caseSensitive: true });

router.get("/", controller.getAll);

export default router;
