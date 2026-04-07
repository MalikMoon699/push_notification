import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastUsed: { type: Date },
    keyCalles: { type: Number, default: 0 },
    key: { type: String, required: true, unique: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Apikey", keySchema);
