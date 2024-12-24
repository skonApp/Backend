import mongoose from "mongoose";
const { Schema, model } = mongoose;

const spinHistorySchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prize: { type: String, required: true },
    type: { type: String, enum: ["money", "sub", "nothing"], required: true },
    value: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("SpinHistory", spinHistorySchema);
