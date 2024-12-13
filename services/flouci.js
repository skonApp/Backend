import axios from "axios";

const FLOUCI_URL = "https://developers.flouci.com/api/generate_payment";

export const generatePayment = async (payload) => {
  try {
    const response = await axios.post(FLOUCI_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Error with Flouci payment generation:", error);
    throw new Error("Payment generation failed. Please try again later.");
  }
};
