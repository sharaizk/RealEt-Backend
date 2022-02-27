import { Router } from "express";
import { getAllcities } from "../controllers/geography/cities.controller";
import { getLocations } from "../controllers/geography/locations.controller";

const router = Router();

router.get("/cities", getAllcities);

router.get("/locations", getLocations);

export default router;
