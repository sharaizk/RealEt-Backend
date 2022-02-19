import { Router } from "express";
import {
  postAd,
  getAdByUserId,
  removeAd,
  featureProperty,
  getAllAds,
  editAd,
} from "../controllers/ad.controller";

import multer from "multer";
import { agentOrConsumer } from "../middlewares/roles.middleware";

const upload = multer({ dest: "uploads/" });

const router = Router();

/**
 * @body
 * title
 * photos
 * description
 * type
 * info - {price, coords, societyName, city province, size}
 */
router.post("/post", userAuth, agentOrConsumer, upload.array("photos"), postAd);

/**
 * @param
 *id -userId
 */
router.get("/getUserAd/:id", getAdByUserId);

/**
 * @param
 *Ad Id -id
 */
router.delete("/remove/:id", removeAd);

/**
 * @param
 *Ad Id -id
 */
router.put("/feature/:id", featureProperty);

/**
 *All Ads
 */
router.get("/", getAllAds);

/**
 * @body
 * @param
 * title
 * photos
 * description
 * type
 * info - {price, coords, societyName, city province, size,type}
 */
router.put("/update/:id", upload.array("photos"), editAd);

export default router;
