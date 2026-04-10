import ApiUsage from "../models/apiUsage.model.js";
import ApiKey from "../models/apiKey.model.js";
import mongoose from "mongoose";

export const getDashBoardData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [monthlyRaw, weeklyRaw, hourlyRaw, summaryRaw] = await Promise.all([
      ApiUsage.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startOfYear },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            success: {
              $sum: {
                $cond: [{ $eq: ["$success", true] }, 1, 0],
              },
            },
            fail: {
              $sum: {
                $cond: [{ $eq: ["$success", false] }, 1, 0],
              },
            },
            sent: { $sum: 1 },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            requests: { $sum: 1 },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startOfDay },
          },
        },
        {
          $group: {
            _id: {
              $hour: {
                date: "$createdAt",
                timezone: "Asia/Karachi",
              },
            },
            requests: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statsRaw = await ApiUsage.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ["$success", true] }, 1, 0],
            },
          },
          failCount: {
            $sum: {
              $cond: [{ $eq: ["$success", false] }, 1, 0],
            },
          },
        },
      },
    ]);

    const monthsMap = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthly = monthsMap.map((month, index) => {
      const found = monthlyRaw.find((m) => m._id === index + 1);
      return {
        month,
        success: found?.success || 0,
        fail: found?.fail || 0,
        sent: found?.sent || 0,
      };
    });

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weekly = daysMap.map((day, index) => {
      const found = weeklyRaw.find((d) => d._id === index + 1);
      return {
        Day: day,
        requests: found?.requests || 0,
      };
    });

    const hourlySlots = Array.from({ length: 24 }, (_, i) => i);

    const hourly = hourlySlots.map((hour) => {
      const found = hourlyRaw.find((h) => h._id === hour);
      return {
        Hour: String(hour).padStart(2, "0"),
        requests: found?.requests || 0,
      };
    });

    const statsData = statsRaw[0] || {
      totalRequests: 0,
      successCount: 0,
      failCount: 0,
    };

    const successRate =
      statsData.totalRequests > 0
        ? ((statsData.successCount / statsData.totalRequests) * 100).toFixed(2)
        : 0;

    const failRate =
      statsData.totalRequests > 0
        ? ((statsData.failCount / statsData.totalRequests) * 100).toFixed(2)
        : 0;

    const stats = {
      totalRequests: statsData.totalRequests,
      successCount: statsData.successCount,
      failCount: statsData.failCount,
      successRate: Number(successRate),
      failRate: Number(failRate),
      creditsUsed: statsData.successCount,
    };
    return res.status(200).json({
      success: true,
      data: {
        monthly,
        weekly,
        hourly,
        stats,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();

    // Date ranges
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [weeklyRaw, weeklyKeysRaw, monthlyRaw, statsRaw] = await Promise.all([
      ApiUsage.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            success: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
            fail: { $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] } },
            sent: { $sum: 1 },
          },
        },
      ]),

      ApiKey.aggregate([
        {
          $match: {
            createdBy: userId,
            createdAt: { $gte: startOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            keys: { $sum: 1 },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startOfYear },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            success: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
            fail: { $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] } },
            sent: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      ApiUsage.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            successCount: {
              $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
            },
            failCount: {
              $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsMap = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const analyticsWeekly = daysMap.map((day, index) => {
      const found = weeklyRaw.find((d) => d._id === index + 1);
      return {
        Day: day,
        success: found?.success || 0,
        fail: found?.fail || 0,
        sent: found?.sent || 0,
      };
    });

    const analyticsWeeklyApiCreate = daysMap.map((day, index) => {
      const found = weeklyKeysRaw.find((d) => d._id === index + 1);
      return { Day: day, keys: found?.keys || 0 };
    });

    const analyticsMonthly = monthsMap.map((month, index) => {
      const found = monthlyRaw.find((m) => m._id === index + 1);
      return {
        month,
        success: found?.success || 0,
        fail: found?.fail || 0,
        sent: found?.sent || 0,
      };
    });

    const stats = statsRaw[0] || {
      totalRequests: 0,
      successCount: 0,
      failCount: 0,
    };
    const creditsUsed = stats.successCount;

    const States = {
      totalRequests: stats.totalRequests,
      successCount: stats.successCount,
      failCount: stats.failCount,
      creditsUsed,
      keysCreated: await ApiKey.countDocuments({ createdBy: userId }),
    };

    return res.status(200).json({
      success: true,
      data: {
        analyticsWeekly,
        analyticsWeeklyApiCreate,
        analyticsMonthly,
        States,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

export const getApiWeeklyRequests = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyRaw = await ApiUsage.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          success: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
          fail: { $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] } },
          sent: { $sum: 1 },
        },
      },
    ]);

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const apiKeyWeek = daysMap.map((day, index) => {
      const found = weeklyRaw.find((d) => d._id === index + 1);
      return {
        Day: day,
        success: found?.success || 0,
        fail: found?.fail || 0,
        sent: found?.sent || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: apiKeyWeek,
    });
  } catch (error) {
    console.error("Weekly API Requests Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly API usage",
    });
  }
};