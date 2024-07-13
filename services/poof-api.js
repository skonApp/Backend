// poof-api.js
import axios from 'axios';

const poofApiEndpoint = 'https://www.poof.io/api/v2'; // Replace with the actual Poof API endpoint
const poofApiKey = 'JjCHXORoPFcc_DqtVJqJtA'; // Replace with your Poof API key
const poofApiSecret = 'YOUR_POOF_API_SECRET'; // Replace with your Poof API secret

export const api = axios.create({
  baseURL: poofApiEndpoint,
  headers: {
    'Authorization': `Bearer ${poofApiKey}`,
    'Content-Type': 'application/json'
  }
});

