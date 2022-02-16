import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  roleSignup,
  userLogin,
  userSignup,
  verifyOTP,
} from "../controllers/auth/auth.controller";
import {
  findUser,
  validateAuth,
  validateLoginType,
} from "../middlewares/validation.middleware";
import { userExists } from "../validators/auth.validator";

const router = Router();

router.post("/login", validateAuth, userLogin);

router.post("/signup", validateAuth, userSignup, roleSignup);

router.patch("/forgot-password", validateLoginType, findUser, forgotPassword);

router.patch("/reset-password", validateLoginType, verifyOTP, resetPassword);

export default router;
