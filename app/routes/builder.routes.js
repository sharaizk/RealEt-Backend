import { Router } from "express";
import {
  getBuilders,
  builderProfile,
  becomeABuilder,
} from "../controllers/builder.controller";
import { userAuth } from "../middlewares/auth.middleware";

import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = Router();

/**
 * To Get All Builders
 */
router.get("/", getBuilders);

/**
 * Get Agent Profile
 */
router.get("/profile", userAuth, builderProfile);

/**
 * To Become a Builder
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
  becomeABuilder
);

export default router;
