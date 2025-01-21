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
    phoneNumber: {
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
    withdraws: [
      {
        method: { type: String, required: true },
        amount: { type: Number, required: true },
        note: { type: String },
        date: { type: Date, required: true, default: Date.now },
        approved: { type: Boolean, require: true ,default : false},
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSubscription",
      },
    ],
    spin: {
      type: Number,
      default: 0,
    },
    confirmInvitedUser: {
      type: Number,
      default: 0,
    },
    monthlyConfirmInvites: {
      type: Number,
      default: 0, 
    },
    monthlyDeposit :{
      type: Number,
      default: 0, 
    },
  },
  {
    timestamps: true,
  }
);
export default model("User", userSchema);
