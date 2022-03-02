import { Router } from "express";
import {
  postAd,
  myAds,
  removeAd,
  featureProperty,
  getAllAds,
  editAd,
} from "../controllers/ad.controller";

import multer from "multer";
import { agentOrConsumer, isAdmin } from "../middlewares/roles.middleware";
import { userAuth } from "../middlewares/auth.middleware";

const upload = multer({ dest: "uploads/" });

const router = Router();

/**
 * @body
 * title
 * photos
 * description
 * type
 * info - {price, coords, societyName, city, province, size, unit, features[], Location}
 * city
 * province
 * location
 */
router.post("/post", userAuth, agentOrConsumer, upload.array("photos"), postAd);

/**
 * @headers
 * x-access-token
 */
router.get("/myAds", userAuth, myAds);

/**
 * @param
 *Ad Id -id
 */
router.delete("/remove/:id", userAuth, isAdmin, removeAd);

/**
 * @param
 * Ad Id -id
 */
router.put("/feature/:id", userAuth, isAdmin, featureProperty);

/**
 *All Ads
 */
router.post("/list", userAuth, getAllAds);

/**
 * @param id - Id of Ad
 * @body
 * title
 * photos
 * description
 * type
 * info - {price, coords, societyName, city province, size,type}
 */
router.put("/update/:id", userAuth, upload.array("photos"), editAd);

export default router;
