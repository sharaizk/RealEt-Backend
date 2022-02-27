import { Router } from "express";
import { adRoutes, authRoutes, geographyRoutes, portfolioRoute } from ".";
import { validateLoginType } from "../middlewares/validation.middleware";

const router = Router();

// Auth Routes for All types of Users
router.use("/auth", validateLoginType, authRoutes);

router.use("/ad", adRoutes);

router.use("/portfolio", portfolioRoute);

router.use("/geography", geographyRoutes);

export default router;
