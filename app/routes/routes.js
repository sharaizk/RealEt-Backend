import { Router } from "express";
import { authRoutes } from ".";
import { validateLoginType } from "../middlewares/validation.middleware";

const router = Router();

// Auth Routes for All types of Users
router.use("/auth", validateLoginType, authRoutes);

export default router;
