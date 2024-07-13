import { createDepositAddress} from "../controllers/deposit.js";
import express from "express";

const router = express.Router();

router.post('/create-deposit-address', createDepositAddress);

export default router;
