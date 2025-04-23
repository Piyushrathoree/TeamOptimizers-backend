import { Router } from "express";
import { getCropsByCommodity, searchCrops } from "../controllers/cropPrice.controller.js";

const router = Router();

router.get("/commodity/:commodity", getCropsByCommodity);
router.get("/search", searchCrops);

export default router;
