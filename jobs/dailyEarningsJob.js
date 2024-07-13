import Cron from "cron";
const CronJob = Cron.CronJob;
import User from "../models/user.js";
import UserSubscription from "../models/userSubscription.js";

export const dailyEarningsJob = new CronJob("0 * * * * *", async () => {
  console.log("Running daily job to update frozen balances");

  await updateFrozenBalances();
});

export const updateFrozenBalances = async () => {
  const now = new Date();

  try {
    // Find all active subscriptions
    const activeSubscriptions = await UserSubscription.find({
      endDate: { $gte: now },
      active: true,
    }).populate("tier");

    for (const subscription of activeSubscriptions) {
      const user = await User.findById(subscription.user);

      if (user) {
        const dailyEarnings = subscription.tier.dailyEarnings;
        user.frozenWallet += dailyEarnings;
        await user.save();
        console.log(`Added $${dailyEarnings} to user: ${user._id}`);
      }
    }
  } catch (error) {
    console.error("Error updating frozen balances:", error);
  }
};

// Start the job
dailyEarningsJob.start();
