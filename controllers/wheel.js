import User from "../models/user.js";
import SpinHistory from "../models/spinHistory.js";
import wheelItems from "../config/WheelItems.js";
import userSubscription from "../models/userSubscription.js";
import subscriptionPlan from "../models/subscriptionPlan.js";
import { error } from "console";


export const spinWheel = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID: ${userId} not found` });
    }

    // Calculate the weighted random selection
    const totalPercentage = wheelItems.reduce((sum, item) => sum + item.percentage, 0);
    const randomNumber = Math.random() * totalPercentage;
    let cumulativePercentage = 0;
    let selectedItem;

    for (const item of wheelItems) {
      cumulativePercentage += item.percentage;
      if (randomNumber <= cumulativePercentage) {
        selectedItem = item;
        break;
      }
    }

    if (!selectedItem) {
      return res
        .status(500)
        .json({ message: "Error determining spin result" });
    }

    // Handle the prize logic
    switch (selectedItem.type) {
      case "money":
        user.wallet += selectedItem.value;
        break;

      case "sub":
        // Find the subscription plan
        const plan = await subscriptionPlan.findOne({
          planName: selectedItem.subscriptionPlan,
        });
        if (!plan) {
          return res.status(404).json({
            message: `Subscription plan "${selectedItem.subscriptionPlan}" not found`,
          });
        }

        // Create a new UserSubscription document
        const newSubscription = await userSubscription.create({
          user: user._id,
          tier: plan._id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
        });

        // Add the subscription ID to the user's subscriptions array
        user.subscriptions.push(newSubscription._id);
        break;

      case "nothing":
        break;

      default:
        return res
          .status(400)
          .json({ message: `Invalid wheel item type: ${selectedItem.type}` });
    }

    // Save the spin history
    const spinHistory = new SpinHistory({
      user: user._id,
      prize: selectedItem.label,
      type: selectedItem.type,
      value: selectedItem.value || 0,
    });
    await spinHistory.save();

    // Save the user
    await user.save();

    res
      .status(200)
      .json({ message: "Spin successful", prize: selectedItem.label });
  } catch (error) {
    console.error("Error during spin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSpinHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch spin history for the user
    const history = await SpinHistory.find({ user: userId }).sort({ date: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No spin history found" });
    }

    res
      .status(200)
      .json({ message: "History retrieved successfully", history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getWheelItems = async (req, res) => {
  try {
    const Items = wheelItems; 
    res.status(200).json(Items);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching wheel items", error });
  }
};

