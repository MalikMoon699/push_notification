import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rewardCredits: { type: Number },
    title: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Reward", rewardSchema);
