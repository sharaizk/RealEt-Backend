import { Router } from "express";
import { becomeAnAgent } from "../controllers/agent.controller";
import { userAuth } from "../middlewares/auth.middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

/**
 * To Become an Agent
 * @body
 * Office Name
 * Office Contact
 * logo
 */
router.post("/apply", userAuth, upload.single("logo"), becomeAnAgent);

export default router;
