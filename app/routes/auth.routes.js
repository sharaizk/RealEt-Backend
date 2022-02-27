import { Router } from "express";
import multer from "multer";
import {
  forgotPassword,
  resetPassword,
  roleSignup,
  userLogin,
  userSignup,
  verifyOTP,
} from "../controllers/auth/auth.controller";
import { findUser, validateAuth } from "../middlewares/validation.middleware";

const upload = multer({ dest: "uploads/" });

const router = Router();

/**
 * @body
 * login - email or phoneNumber
 * password
 */
router.post("/login", validateAuth, userLogin);

/**
 * @body
 * login - email or phoneNumber
 * password
 * fulName
 * role - optional, Consumer by default
 */
router.post(
  "/signup",
  upload.single("photo"),
  validateAuth,
  userSignup,
  roleSignup
);

/**
 * @body
 * login - email or phoneNumber
 */
router.patch("/forgot-password", findUser, forgotPassword);

/**
 * @body
 * login - email or phoneNumber
 * otp
 */
router.patch("/verify-otp", verifyOTP);

/**
 * @body
 * login - email or phoneNumber
 * password
 */
router.patch("/reset-password", resetPassword);

export default router;
