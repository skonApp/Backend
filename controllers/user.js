import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
// unique id :
import { v4 as uuidv4 } from "uuid";

const secretKey = process.env.JWT_SECRET;

//login
export async function signin(req, res) {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber }).populate({
      path: "subscriptions",
      populate: {
        path: "tier",
        model: "SubscriptionPlan",
      },
    });

    if (!user) {
      res.status(404).json({ message: "number or password invalid !!" });
    } else {
      const validPass = bcrypt.compareSync(password, user.password);
      if (!validPass) {
        res.status(401).json({ message: "number or password invalid !!" });
      } else {
        const payload = {
          _id: user._id,
          name: user.name,
          lastname: user.lastname,
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
          wallet: user.wallet,
          frozenWallet: user.frozenWallet,
          invitationCode: user.phoneNumber,
          activeSubscription: user.activeSubscription,
          planName: user.activeSubscription
            ? user.activeSubscription.tier.planName
            : "Free",
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        res.status(200).json({ user: payload, MyToken: token });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
// Registre user
export async function signup(req, res) {
  try {
    const { name, lastname, password, phoneNumber, invitationCode } = req.body;

    const exist = await User.findOne({ phoneNumber });
    if (exist) {
      return res.status(409).json({
        status: 409,
        message: "Account already exists!",
      });
    }
    

    let avatar = null;
    if (req.file) {
      avatar = req.file.filename;
    }

    // Crypt password
    const salt = bcrypt.genSaltSync(10);
    const cryptedPass = bcrypt.hashSync(password, salt);

    // Create unique invitation code
    // const uniqueInvitationCode = uuidv4();

    // Create new user object
    const user = new User({
      name,
      lastname,
      password: cryptedPass,
      avatar,
      phoneNumber,
      invitationCode: phoneNumber,
    });

    // Check if invitation code is provided and assign referUser
    if (invitationCode) {
      const invitingUser = await User.findOne({ invitationCode });
      if (invitingUser) {
        user.referUser = invitingUser._id;
      }
    }

    // Save new user
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// update user
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPass = bcrypt.compareSync(currentPassword, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Retrieve Invited Users
export async function getReferredUsers(req, res) {
  try {
    const userId = req.params.userId;
    const referredUsers = await User.find({ referUser: userId });
    res.status(200).json(referredUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getInvitingUser(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("referUser");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.referUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// get use data
export async function getUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate({
      path: "subscriptions",
      populate: {
        path: "tier",
        model: "SubscriptionPlan",
      },
    });
    console.log('user info :',user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found successful", user });
  } catch (error) {
    res.status(400).json({ message: "Failed to get user", error });
  }
}
