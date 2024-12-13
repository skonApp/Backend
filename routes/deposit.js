import express from "express";
import { deposit } from "../controllers/deposit.js";

const router = express.Router();

router.post("/generate-payment", deposit);

export default router;
