import { Router } from "express";
import { becomeAnAgent, agentProfile } from "../controllers/agent.controller";
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
router.post(
  "/apply",
  userAuth,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "cnic",
      maxCount: 2,
    },
  ]),
  becomeAnAgent
);

/**
 * Get Agent ProfileImage
 *
 */
router.get("/profile", userAuth, agentProfile);

export default router;
