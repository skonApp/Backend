import { response } from "express";
import { generatePayment } from "../services/flouci.js";
import axios from "axios";
const port = process.env.PORT;
const FLOUCI_SECRET = process.env.FLOUCI_SECRET;
const FLOUCI_URL = "https://developers.flouci.com/api/generate_payment";

export async function deposit(req, res) {
  const { amount } = req.body;
  const payload = {
    app_token: "e509c457-f8d2-4e60-881a-26024631335d",
    app_secret: FLOUCI_SECRET,
    amount: amount,
    accept_card: "true",
    session_timeout_secs: 1200,
    success_link: `http://localhost:${port}/success`,
    fail_link: `http://localhost:${port}/fail`,
    developer_tracking_id: "ac0f7a86-37a8-4f8a-a185-14413cd2d7e1",
  };
  try {
    console.log("Payload being sent to Flouci:", payload);
    const paymentResponse = await generatePayment(payload);
    console.log("Payment Response from Flouci:", paymentResponse); // Log the actual response from Flouci
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error("Error during payment generation:", error);
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
      stack: error.stack  // Include stack trace for debugging
    });
  }
}

// export async function deposit1(req, res) {
//   const { amount } = req.body;
//   const payload = {
//     app_token: "e509c457-f8d2-4e60-881a-26024631335d",
//     app_secret: FLOUCI_SECRET,
//     amount: amount,
//     accept_card: "true",
//     session_timeout_secs: 1200,
//     success_link: `http://localhost:${port}/success`,
//     fail_link: `http://localhost:${port}/fail`,
//     developer_tracking_id: "ac0f7a86-37a8-4f8a-a185-14413cd2d7e1",
//   };
//   try {
//     console.log("Payload being sent to Flouci:", payload);
//     const response = await axios.post(FLOUCI_URL, payload);

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error during payment generation:", error);
//     res.status(500).json({
//       message: "Payment failed",
//       error: error.message,
//       stack: error.stack, // Include stack trace for debugging
//     });
//   }
// }

