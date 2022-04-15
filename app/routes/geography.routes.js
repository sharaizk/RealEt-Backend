import { Router } from "express";
import { getAllcities } from "../controllers/geography/cities.controller";
import {
  getAllLocations,
  getLocations,
} from "../controllers/geography/locations.controller";

const router = Router();

router.get("/cities", getAllcities);

router.get("/all-locations", getAllLocations);

router.get("/locations", getLocations);

export default router;
