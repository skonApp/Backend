// deposit.controller.js
import axios from "axios";
import crypto from 'crypto';
import { response } from "express";

const API_KEY = ""
const MERCHANT = ""
export async function createDepositAddress(req, res) {
  try {
    const { amount, currency } = req.body;
    const data = {
      amount,
      currency,
      order_id: 1,
    };
    const sign = crypto.createHash("md5").update(Buffer.from(JSON.stringify(data)).toString("base64")+API_KEY).digest("hex");
    const reponse = await axios.post(
      "https://api.cryptomus.com/v1/payment",
      data,{headers : {merchant : ""},sign :sign }
    );
    res.status(200).send("data :", response.data);
  } catch (error) {
    res.status(400).send("error :", error);
  }
}
