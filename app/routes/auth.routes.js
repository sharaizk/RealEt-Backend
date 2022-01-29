import { Router } from "express";
import { userLogin } from "../controllers/auth/auth.controller";

const router = Router();

router.post("/login/email", userLogin);

export default router;
