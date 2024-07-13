import express from "express";
import {
  getInvitingUser,
  getReferredUsers,
  getUser,
  signin,
  signup,
  updatePassword,
} from "../controllers/user.js";
import multer from "../middlewares/multer-config.js";
import authenticateToken from "../middlewares/authenticateToken.js";


const router = express.Router();


const upload = multer("avatar", { fileSize: 1024 * 1024 }); // Set field name and file size limit

router.post("/signup", upload, signup);
router.post("/signin",signin);
router.get("/:userId", getUser);
router.put("/updatePassword/:userId", updatePassword);
router.get("/referred-users/:userId", getReferredUsers);
router.get("/inviting-user/:userId", getInvitingUser);

export default router;
