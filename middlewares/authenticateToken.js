import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;
// console.log("Secret Key:", secretKey); // Add this line to verify the secret key

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Get the Authorization header
//   console.log(`the header :${authHeader}`);
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the header
  if (token == null) return res.sendStatus(401); // If no token, return 401 Unauthorized

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, return 403 Forbidden
    req.user = user; // Attach decoded user information to the request object
    next(); // Pass control to the next middleware or route handler
  });
}
