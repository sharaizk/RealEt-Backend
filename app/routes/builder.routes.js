import { Router } from "express";
import {
  getBuilders,
  getSingleBuilder,
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
 * To Get a Single Builder
 */
router.get("/single/:id", getSingleBuilder);

/**
 * To Become a Builder
 * @body
 * Office Name
 * Office Contact
 * logo
 */
router.post("/apply", userAuth, upload.single("logo"), becomeABuilder);

export default router;
