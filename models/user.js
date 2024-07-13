import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    referralEarnings: { type: Number, default: 0 },
    invitationCode: { type: String, unique: true, require: true },
    referUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wallet: {
      type: Number,
      required: true,
      default: 0,
    },
    frozenWallet: {
      type: Number,
      required: true,
      default: 0,
    },
    deposits: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
    activeSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
    },
  },
  {
    timestamps: true,
  }
);
export default model("User", userSchema);
