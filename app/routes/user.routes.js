import { Router } from "express";
import { roleSwitch } from "../controllers/user.controller";

const router = Router();

router.patch("/switch-role", roleSwitch);

export default router;
