import { Router } from "express";
import {
  roleSignup,
  userLogin,
  userSignup,
} from "../controllers/auth/auth.controller";
import { validateAuth } from "../middlewares/validation.middleware";

const router = Router();

router.post("/login", validateAuth, userLogin);

router.post("/signup", validateAuth, userSignup, roleSignup);

export default router;
