import { Router } from "express";
import {
  addPortfolio,
  myPortfolio,
  removePortfolio,
  editPortfolio,
  getAllPortfolio,
  getAllPortfolioOfSingleBuilder,
} from "../controllers/portfolio.controller";
import multer from "multer";
import { builderOrConsumer } from "../middlewares/roles.middleware";
import { userAuth } from "../middlewares/auth.middleware";
const upload = multer({ dest: "uploads/" });
const router = Router();

/**
 * @body
 * title
 * photos
 * description
 * type
 * info - {yearBuilt,coords, societyName, city, province, size, unit, features[], Location}
 * city
 * province
 * location
 */
router.post(
  "/add",
  userAuth,
  builderOrConsumer,
  upload.array("photos"),
  addPortfolio
);

/**
 * @headers
 * x-access-token
 */
router.get("/myPortfolio", userAuth, myPortfolio);

/**
 * @param
 * Portfolio Id -id
 */
router.delete("/remove/:id", userAuth, removePortfolio);

/**
 * @body
 * title
 * photos
 * description
 * type
 * info - {yearBuilt,coords, societyName, city, province, size, unit, features[], Location}
 * city
 * province
 * location
 */
router.patch("/update/:id", userAuth, upload.array("photos"), editPortfolio);

/**
 *All Portfolio
 */
router.get("/list", getAllPortfolio);
export default router;

/**
 * All Portfolio of a Single Builder
 */

router.get("/builder/:id", getAllPortfolioOfSingleBuilder);
