import { Router } from "express";
import { postAd } from "../controllers/ad.controller";

import multer from "multer";

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
router.post("/post", upload.array("photos"), postAd);

export default router;
