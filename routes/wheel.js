import express from "express";
import { getSpinHistory, spinWheel } from "../controllers/wheel.js";

const router = express.Router();


router.post("/spin",spinWheel);
router.get("/spinHistory/:userId",getSpinHistory);

export default router;
