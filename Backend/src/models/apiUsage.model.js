import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    apiKey: { type: mongoose.Schema.Types.ObjectId, ref: "Apikey" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    useCase: { type: String },
    success: { type: Boolean },
    date: { type: Date },
    calls: { type: Number, default: 0 },
  },
  { timestamps: true },
);

usageSchema.index({ user: 1, createdAt: 1 });
export default mongoose.model("ApiUsage", usageSchema);
