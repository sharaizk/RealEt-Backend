import { Router } from "express";
import {
  getBuilders,
  getSingleBuilder,
} from "../controllers/builder.controller";
const router = Router();

/**
 * To Get All Builders
 */
router.get("/", getBuilders);

/**
 * To Get a Single Builder
 */
router.get("/single/:id", getSingleBuilder);

export default router;
