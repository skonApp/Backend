import {
  createSub,
  getSub,
  activateSubscription,
} from "../controllers/subscription.js";
import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/", createSub);
router.get("/", getSub);
router.post("/activateSub", activateSubscription);

export default router;
