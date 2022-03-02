import { Router } from "express";
import multer from "multer";
import { getAllAds } from "../controllers/ad.controller";
import {
  getAllUsers,
  updateAdmin,
  dashboardCounts,
} from "../controllers/admin/admin.controller";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.patch("/update-profile", upload.single("photo"), updateAdmin);

router.post("/users-list", getAllUsers);

router.post("/ads-list", getAllAds);

router.get("/dashboard-counts", dashboardCounts);

export default router;
