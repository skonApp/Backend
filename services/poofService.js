import axios from "axios";

const POOF_API_URL = "https://www.poof.io/api/v2/create_charge";

/**
 * Function to create a charge on Poof.io
 * @param {number} amount - The amount to deposit
 * @param {string} crypto - The type of cryptocurrency
 * @param {Object} metadata - Additional metadata for the charge
 * @returns {Object} - The response data from Poof.io
 */
export const createCharge = async (amount, crypto, metadata) => {
  try {
    const response = await axios.post(
      POOF_API_URL,
      {
        amount: amount.toString(),
        crypto,
        metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating charge:", error);
    throw error;
  }
};
