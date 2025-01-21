import express from "express";
import { createAchievementItem ,claimAchievementItem} from "../controllers/achievement.js";

const router = express.Router();

router.post("/", createAchievementItem);
router.post("/claim", claimAchievementItem);

export default router;
