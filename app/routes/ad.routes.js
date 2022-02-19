import { Router } from "express";
import { postAd } from "../controllers/ad.controller";
import { userAuth } from "../middlewares/auth.middleware";
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

export default router;
