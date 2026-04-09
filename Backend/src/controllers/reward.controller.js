import User from "../models/user.model.js";
import Reward from "../models/reward.model.js";

export const claimTodayReward = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (
      user.lastClaimDate &&
      user.lastClaimDate >= todayStart &&
      user.lastClaimDate <= todayEnd
    ) {
      return res.status(400).json({
        success: false,
        message: "You have already claimed today's reward",
      });
    }

    const rewardCredits = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    user.credits += rewardCredits;
    user.lastClaimDate = new Date();

    await user.save();
    await Reward.create({
      user: userId,
      rewardCredits,
      title: "Daily reward",
    });

    return res.status(200).json({
      success: true,
      message: "Reward claimed successfully",
      data: {
        rewardCredits,
        totalCredits: user.credits,
        claimedAt: user.lastClaimDate,
        title: "Daily reward",
      },
    });
  } catch (err) {
    console.error("Claim today reward error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

export const claimFirstLoginReward = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.firstSignUpClaim) {
      return res.status(400).json({
        success: false,
        message: "First login reward already claimed",
      });
    }

    const rewardCredits = 100;
    user.credits += rewardCredits;
    user.firstSignUpClaim = true;

    await user.save();

    await Reward.create({
      user: userId,
      rewardCredits,
      title: "Create account reward",
    });

    return res.status(200).json({
      success: true,
      message: "First login reward claimed successfully",
      data: {
        rewardCredits,
        totalCredits: user.credits,
        title: "Create account reward",
        claimedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Claim first login reward error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

export const getRewardHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const total = await Reward.countDocuments({ user: userId });
    const records = await Reward.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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
    console.error("Get reward history error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};