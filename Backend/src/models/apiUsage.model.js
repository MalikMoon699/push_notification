import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    apiKey: { type: mongoose.Schema.Types.ObjectId, ref: "Apikey" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    useCase: { type: String },
    success: { type: Boolean },
    date: { type: Date },
    calls: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("ApiUsage", usageSchema);
