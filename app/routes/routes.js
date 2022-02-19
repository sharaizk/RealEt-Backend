import { Router } from "express";
import { authRoutes, adRoutes } from ".";

import { validateLoginType } from "../middlewares/validation.middleware";

const router = Router();

// Auth Routes for All types of Users
router.use("/auth", validateLoginType, authRoutes);

router.use("/ad", adRoutes);

export default router;
