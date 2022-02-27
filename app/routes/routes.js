import { Router } from "express";
import multer from "multer";
import { adRoutes, authRoutes, geographyRoutes, portfolioRoute } from ".";
import { roleSignup, userSignup } from "../controllers/auth/auth.controller";
import {
  validateAuth,
  validateLoginType,
} from "../middlewares/validation.middleware";

const router = Router();
const upload = multer({ dest: "uploads/" });
/**
 * @body
 * login - email or phoneNumber
 * password
 * fulName
 * role - optional, Consumer by default
 */
router.post(
  "/auth/signup",
  upload.single("photo"),
  validateLoginType,
  validateAuth,
  userSignup,
  roleSignup
);

// Auth Routes for All types of Users
router.use("/auth", validateLoginType, authRoutes);

router.use("/ad", adRoutes);

router.use("/portfolio", portfolioRoute);

router.use("/geography", geographyRoutes);

export default router;
