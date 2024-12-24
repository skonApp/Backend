import User from "../models/user.js";
import SpinHistory from "../models/spinHistory.js";
import wheelItems from "../config/WheelItems.js";
import userSubscription from "../models/userSubscription.js";
import subscriptionPlan from "../models/subscriptionPlan.js"; 

export const spinWheel = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the selected wheel item
    const wheelItem = wheelItems.find((item) => item.id === itemId);
    if (!wheelItem) {
      return res.status(404).json({ message: "Invalid wheel item" });
    }

    // Handle the prize logic
    switch (wheelItem.type) {
      case "money":
        user.wallet += wheelItem.value; 
        break;

      case "sub":
        // Find the subscription plan
        const plan = await subscriptionPlan.findOne({ planName: wheelItem.subscriptionPlan }); 
        if (!plan) {
          return res.status(404).json({ message: "Subscription plan not found" });
        }

        // Create a new UserSubscription document
        const newSubscription = await userSubscription.create({
          user: user._id,
          tier: plan._id, 
          startDate: new Date(),
          endDate: new Date(Date.now() + 7  * 60 * 60 * 1000), // 7 hours from now
        });

        // Add the subscription ID to the user's subscriptions array
        user.subscriptions.push(newSubscription._id);
        break;

      case "nothing":
        break;

      default:
        return res.status(400).json({ message: "Invalid wheel item type" });
    }

    // Save the spin history
    const spinHistory = new SpinHistory({
      user: user._id,
      prize: wheelItem.label,
      type: wheelItem.type,
      value: wheelItem.value || 0,
    });
    await spinHistory.save();

    // Save the user
    await user.save();

    res.status(200).json({ message: "Spin successful", prize: wheelItem.label });
  } catch (error) {
    console.error(error);
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

    res.status(200).json({ message: "History retrieved successfully", history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
