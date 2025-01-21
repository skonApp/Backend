import AchievementItem from "../models/achievementItem.js";
import UserSubscription from "../models/userSubscription.js";
import SubscriptionPlan from "../models/subscriptionPlan.js";
import User from "../models/user.js";
import UserAchievement from "../models/userAchievement.js";

export async function createAchievementItem(req, res) {
  const {
    title,
    description,
    actionType,
    goal,
    prizeType,
    prizeValue,
  } = req.body;
  try {
    // Check if achievement already exists
    const item = await AchievementItem.findOne({ title });
    if (item)
      return res
        .status(409)
        .json({ message: "achievement already exist! , same title" });

    // Create a new achievement
    const newAchievement = new AchievementItem({
      title,
      description,
      actionType,
      goal,
      prizeType,
      prizeValue,
      progress,
    });

    // Save the achievement
    await newAchievement.save();

    return res.status(201).json({
      message: "Achievement added successfully",
      achievement: newAchievement,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

// claim Item :
export async function claimAchievementItem(req, res) {
  try {
    const { userId, achievementId } = req.body;
    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID: ${userId} not found` });
    }
    const invite = user.monthlyConfirmInvites;
    const userAchievement = await UserAchievement.findOne({
      user: userId,
      achievement: achievementId,
    }).populate("achievement");

    if (!userAchievement) {
      throw new Error("Achievement not found.");
    }

    if (userAchievement.isClaimed) {
      throw new Error("Achievement already claimed.");
    }

    const { actionType, goal, prizeType, prizeValue, title } =
      userAchievement.achievement;
    // Validate the requirement
    let requirementMet = false;
    if (actionType === "invite" && user.monthlyConfirmInvites >= goal) {
      requirementMet = true;
    } else if (actionType === "deposit" && user.monthlyDeposit >= goal) {
      requirementMet = true;
    }
    //  else if (actionType === "share" && user.monthlyShares >= goal) {
    //   requirementMet = true;
    // }

    if (!requirementMet) {
      return res.status(400).json({
        message: `Requirement not met for achievement "${title}".`,
      });
    }
    // Handle the prize logic
    switch (prizeType) {
      case "sub":
        // Find the subscription plan
        const plan = await SubscriptionPlan.findOne({
          planName: title,
        });
        if (!plan) {
          return res.status(404).json({
            message: `Subscription plan "${title}" not found`,
          });
        }
        // Create a new UserSubscription document
        const newSubscription = await UserSubscription.create({
          user: userId,
          tier: plan._id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
        });

        // Add the subscription ID to the user's subscriptions array
        user.subscriptions.push(newSubscription._id);
        break;
    }

    userAchievement.isClaimed = true;
    await userAchievement.save();
    // Save the user
    await user.save();
    // Return a success response
    return res.status(200).json({
      message: `Achievement "${title}" claimed successfully.`,
    });
  } catch (error) {
    console.error("Error claiming achievement item:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
