import express from "express";
import { getSpinHistory, getWheelItems, spinWheel } from "../controllers/wheel.js";

const router = express.Router();


router.post("/spin",spinWheel);
router.get("/spinHistory/:userId",getSpinHistory);
router.get("/wheelItems",getWheelItems);

export default router;
