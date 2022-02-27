import { Router } from "express";
import { authRoutes, adRoutes } from ".";
import { authRoutes, adRoutes, portfolioRoute, geographyRoutes } from ".";

import { validateLoginType } from "../middlewares/validation.middleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = Router();

// Auth Routes for All types of Users
router.use("/auth", upload.single("photo"), validateLoginType, authRoutes);

router.use("/ad", adRoutes);

router.use("/portfolio", portfolioRoute);

router.use("/geography", geographyRoutes);

export default router;
