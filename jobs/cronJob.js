import Cron from "cron";
const CronJob = Cron.CronJob;
import User from "../models/user.js";
import UserSubscription from "../models/userSubscription.js";

// Function to check and remove expired subscriptions
export const checkExpiredSubscriptions = async () => {
  const now = new Date();

  try {
    // Find all subscriptions where the end date is in the past
    const expiredSubscriptions = await UserSubscription.find({
      endDate: { $lt: now },
      active: true, // Only consider active subscriptions
    });

    for (const subscription of expiredSubscriptions) {
      const user = await User.findById(subscription.user);

      if (
        user &&
        user.subscription &&
        user.subscription.equals(subscription._id)
      ) {
        // Remove the active subscription reference from the user
        user.subscriptions = null;
        await user.save();
        console.log(`Removed expired subscription for user: ${user._id}`);
      }
      // Mark the subscription as inactive
      subscription.active = false;
      await subscription.save();
    }
  } catch (error) {
    console.error("Error removing expired subscriptions:", error);
  }
};

// Cron job to check for expired subscriptions every minute
export const job = new CronJob("*/30 * * * * *", async () => {
  console.log("Running job to check for expired subscriptions");
  await checkExpiredSubscriptions();
});

// Start the job
job.start();
