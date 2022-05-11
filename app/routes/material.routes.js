import { Router } from "express";
import { addMaterial } from "../controllers/materials.controller";

const router = Router();

router.post("/new-material", addMaterial);

export default router;
