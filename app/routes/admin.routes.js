import { Router } from "express";
import multer from "multer";
import {
  getAllUsers,
  updateAdmin,
  dashboardCounts,
  roleUpdate,
  getPendingAds,
  getAllAds,
  getAgents,
  changeAdStatus,
  getBuilders
} from "../controllers/admin/admin.controller";

const router = Router();

const upload = multer({ dest: "uploads/" });

/**
 * Update Admin Profile
 */
router.patch("/update-profile", upload.single("photo"), updateAdmin);

/**
 * Get All Users Lists
 * @body - role
 */
router.post("/users-list", getAllUsers);

/**
 * Get All Ads List
 */
router.post("/ads-list", getAllAds);

/**
 * Get No of Agents, Consumers, Builders, Ads
 */
router.get("/dashboard-counts", dashboardCounts);

/**
 * Update User Roles
 * @param {string} userId
 */
router.patch("/update-role/:userId", roleUpdate);

/**
 * Get All Pending Ads
 */
router.get("/pending-ads", getAllAds);

/**
 * Approve Pending Ads
 * @param {string} userId
 */
router.patch("/approve/:id", changeAdStatus);

/**
 * Get All Agents
 */
router.post("/agents", getAgents);

/**
 * Get All Builders
 */
 router.post("/builders", getBuilders);

export default router;
