import SubscriptionPlan from "../models/subscriptionPlan.js";
import User from "../models/user.js";
import UserSubscription from "../models/userSubscription.js";

export async function createSub(req, res) {
  const { planName, cost, duration, dailyEarnings } = req.body;

  try {
    const newPlan = new SubscriptionPlan({
      planName,
      duration,
      cost,
      dailyEarnings,
    });
    await newPlan.save();
    res
      .status(201)
      .json({ message: "Subscription plan created successfully", newPlan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating subscription plan", error });
  }
}

export async function getSub(req, res) {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({
      message: "Subscription plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subscription plans", error });
  }
}

export async function activateSubscription(req, res) {
  const { userId, planId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    // Check if user has enough balance
    if (user.wallet < plan.cost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct cost from wallet
    user.wallet -= plan.cost;

    // Calculate start and end dates
    const startDate = new Date();
    let endDate = null;
    if (plan.duration !== "0") {
      endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(plan.duration));
    }

    // Create a payment record
    const payment = {
      date: new Date(),
      amount: plan.cost,
    };

    // Create new user subscription
    const userSubscription = new UserSubscription({
      user: userId,
      tier: plan._id,
      startDate: startDate,
      endDate: endDate,
      payments: [payment],
      active: true,
    });

    // Save user subscription
    await userSubscription.save();

      // Push the new subscription to the user's activeSubscriptions array
      await User.findByIdAndUpdate(
        userId,
        { $push: { activeSubscriptions: userSubscription._id } }, // Add to activeSubscriptions array
        { new: true }
      );
      
    await user.save();

    return res.status(200).json({
      message: "Subscription activated successfully",
      userSubscription,
    });
  } catch (error) {
    console.error("Error activating subscription:", error);
    return res.status(500).json({ message: "Error activating subscription" });
  }
}
