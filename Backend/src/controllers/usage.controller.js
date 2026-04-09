import Usage from "../models/apiUsage.model.js";
import mongoose from "mongoose";

export const getUsageStates = async (req, res) => {
  try {
    const userId = req.user.id;
    const successCount = await Usage.countDocuments({
      user: userId,
      success: true,
    });
    const failCount = await Usage.countDocuments({
      user: userId,
      success: false,
    });

    // const creditsUsedAgg = await Usage.aggregate([
    //   {
    //     $match: {
    //       user: new mongoose.Types.ObjectId(userId),
    //       success: true,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalCredits: { $sum: "$calls" },
    //     },
    //   },
    // ]);
    // const creditsUsed = creditsUsedAgg[0]?.totalCredits || 0;

    return res.json({
      success: successCount,
      fail: failCount,
      creditsUsed: successCount, // we can use creditsUsed func it's perfect but successcount and creditsUsed are same so we avoid it for fast
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUsageRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const query = { user: userId };
    if (search) {
      query.$or = [
        { useCase: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      if (status === "success") query.success = true;
      else if (status === "error") query.success = false;
    }

    const records = await Usage.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Usage.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      records,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
