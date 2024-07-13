import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSubscriptionSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    payments: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("UserSubscription", userSubscriptionSchema);
