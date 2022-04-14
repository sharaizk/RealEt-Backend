import { Router } from "express";
import multer from "multer";
import {
  adminRoutes,
  adRoutes,
  authRoutes,
  geographyRoutes,
  portfolioRoute,
  builderRoutes,
  agentRoutes,
} from ".";
import {
  myProfile,
  roleSignup,
  userSignup,
} from "../controllers/auth/auth.controller";
import { userAuth } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/roles.middleware";
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

router.get("/auth/my-profile", userAuth, myProfile);

// Auth Routes for All types of Users
router.use("/auth", validateLoginType, authRoutes);

router.use("/ads", adRoutes);

router.use("/portfolio", portfolioRoute);

router.use("/geography", geographyRoutes);

router.use("/admin", userAuth, isAdmin, adminRoutes);

router.use("/builder", builderRoutes);

router.use("/agent", agentRoutes);

export default router;
