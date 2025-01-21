import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userAchievementSchema = new Schema(
  {
    user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  achievement: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AchievementItem", 
    required: true 
  },

  isClaimed: { 
    type: Boolean, 
    default: false, 
    required: true
  },
}, { timestamps: true });


export default model("UserAchievement", userAchievementSchema);
