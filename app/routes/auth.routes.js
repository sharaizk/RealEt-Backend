import { Router } from "express";
import {
  forgotPassword,
  roleSignup,
  userLogin,
  userSignup,
} from "../controllers/auth/auth.controller";
import { generateOTP } from "../middlewares";
import {
  validateAuth,
  validateLoginType,
} from "../middlewares/validation.middleware";

const router = Router();

router.post("/login", validateAuth, userLogin);

router.post("/signup", validateAuth, userSignup, roleSignup);

router.post("/forgot-password", validateLoginType, forgotPassword);

export default router;
