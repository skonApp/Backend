import mongoose from "mongoose";
const { Schema, model } = mongoose;

const achievementItemSchema = new Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    actionType: {
      type: String,
      enum: ["invite", "deposit", "share"],
      required: true, 
    },
    goal: { type: Number, required: true },
    prizeType: {
      type: String,
      enum: ["sub", "spin"],
      required: true, 
    },
    prizeValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("AchievementItem", achievementItemSchema);
