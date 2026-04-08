import ApiKey from "../models/apiKey.model.js";
import KeyUsage from "../models/apiUsage.model.js";
import mongoose from "mongoose";
import crypto from "crypto";

export const genApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "API key name is required" });
    }
    let newKey;
    let isUnique = false;

    while (!isUnique) {
      const randomPart = crypto.randomBytes(10).toString("hex").slice(0, 18);
      newKey = `dpn_sk_${randomPart}`;

      const existing = await ApiKey.findOne({ key: newKey });
      if (!existing) isUnique = true;
    }

    const apiKey = await ApiKey.create({
      name,
      key: newKey,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "API key created successfully",
      apiKey: {
        _id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    console.error("Generate API key error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ keys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    if (!keyId) {
      return res.status(400).json({ message: "API key ID is required" });
    }

    const key = await ApiKey.findById(keyId);

    if (!key) {
      return res.status(404).json({ message: "API key not found" });
    }

    if (key.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this key" });
    }

    await ApiKey.deleteOne({ _id: keyId });
    await KeyUsage.deleteMany({ apiKey: keyId });

    res.status(200).json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Delete API key error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserApiUsage = async (req, res) => {
  try {
    const total = await KeyUsage.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, totalCalls: { $sum: "$calls" } } },
    ]);

    res.status(200).json({ totalCalls: total[0]?.totalCalls || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApiUsageByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const total = await KeyUsage.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, totalCalls: { $sum: "$calls" } } },
    ]);

    res.status(200).json({ totalCalls: total[0]?.totalCalls || 0 });
  } catch (error) {
    console.error("Get API usage by date error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getApiUsageByMonth = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ message: "Month is required" });
    const [year, mon] = month.split("-").map(Number);
    if (!year || !mon)
      return res.status(400).json({ message: "Invalid month format" });

    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    const total = await KeyUsage.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, totalCalls: { $sum: "$calls" } } },
    ]);

    res.status(200).json({ totalCalls: total[0]?.totalCalls || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
