import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subscriptionPlanSchema = new Schema(
  {
    planName: {
      type: String,
      enum: ["free", "VIP 1", "VIP 2", "VIP 3"],
      required: true,
      default: "free",
    },
    duration: {
      type: String,
      enum: ["7", "14", "0"],
      required: true,
    },
    dailyEarnings: { type: Number, required: true, default: 0 },
    cost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export default model("SubscriptionPlan", subscriptionPlanSchema);
