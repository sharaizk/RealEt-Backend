import { Router } from "express";
import { authRoutes } from ".";

const router = Router();

// Auth Routes for All types of Users
router.use("/auth", authRoutes);

export default router;
