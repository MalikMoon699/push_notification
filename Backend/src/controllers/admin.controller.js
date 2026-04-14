import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import ApiUsage from "../models/apiUsage.model.js";
import Apikey from "../models/apiKey.model.js";
import Reward from "../models/reward.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const userFilter = { role: { $ne: "admin" } };
    const now = new Date();
    const months = [...Array(12)]
      .map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          y: d.getFullYear(),
          m: d.getMonth() + 1,
          key: d.toLocaleString("default", { month: "short" }),
        };
      })
      .reverse();

    const firstMonth = new Date(months[0].y, months[0].m - 1, 1);

    const [
      totalUsers,
      payments,
      apiKeysIssued,
      notificationsToday,
      users,
      userGrowthRaw,
      revenueRaw,
      usageRaw,
      last12MonthsUsers,
    ] = await Promise.all([
      User.countDocuments(userFilter),

      Payment.find({ status: "paid" }).select("price credits createdAt").lean(),

      Apikey.countDocuments(),

      ApiUsage.countDocuments({
        title: "send notification",
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),

      User.find(userFilter, "credits createdAt").lean(),

      User.aggregate([
        {
          $match: {
            ...userFilter,
            createdAt: { $gte: firstMonth },
          },
        },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
            },
            revenue: { $sum: "$price" },
            credits: { $sum: "$credits" },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $group: {
            _id: "$title",
            count: { $sum: "$calls" },
          },
        },
      ]),

      User.countDocuments({
        ...userFilter,
        createdAt: { $gte: firstMonth },
      }),
    ]);

    const userGrowthMap = new Map(
      userGrowthRaw.map((u) => [`${u._id.y}-${u._id.m}`, u.count]),
    );

    const revenueMap = new Map(
      revenueRaw.map((r) => [
        `${r._id.y}-${r._id.m}`,
        { revenue: r.revenue, credits: r.credits },
      ]),
    );

    const usageMap = new Map(usageRaw.map((u) => [u._id, u.count]));

    const userGrothByMonth = months.map((m) => {
      const key = `${m.y}-${m.m}`;
      const newUsers = userGrowthMap.get(key) || 0;

      return {
        key: m.key,
        totalUsers: last12MonthsUsers,
        NewArrival: newUsers,
      };
    });

    const RevenueCreditsSoldByMonth = months.map((m) => {
      const key = `${m.y}-${m.m}`;
      const data = revenueMap.get(key) || { revenue: 0, credits: 0 };

      return {
        key: m.key,
        ravenue: data.revenue,
        credits: data.credits,
      };
    });

    const CreditUsageDistribution = {
      Notifications: usageMap.get("send notification") || 0,
      DeviceTokens: usageMap.get("generate token") || 0,
      UnusedBalance: users.reduce((sum, u) => sum + (u.credits || 0), 0),
    };

    const CreditUsageDistributionFormatted = Object.entries(
      CreditUsageDistribution,
    ).map(([key, value]) => ({
      key,
      value,
    }));

    const TotalCreditsSold = payments.reduce(
      (sum, p) => sum + (p.credits || 0),
      0,
    );

    return res.json({
      States: {
        totalUsers,
        TotalCreditsSold,
        APIKeysIssued: apiKeysIssued,
        NotificationsToday: notificationsToday,
      },

      userGrothByMonth,
      RevenueCreditsSoldByMonth,
      CreditUsageDistributionFormatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

export const getUsersAdmin = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "", status } = req.query;

    const filter = {
      role: { $ne: "admin" },
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [totalUser, users] = await Promise.all([
      User.countDocuments(filter),

      User.find(filter)
        .select("name email status credits createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const userIds = users.map((u) => u._id);

    const apiKeyCounts = await Apikey.aggregate([
      { $match: { createdBy: { $in: userIds } } },
      {
        $group: {
          _id: "$createdBy",
          count: { $sum: 1 },
        },
      },
    ]);

    const apiKeyMap = new Map(
      apiKeyCounts.map((a) => [a._id.toString(), a.count]),
    );

    const usageCounts = await ApiUsage.aggregate([
      {
        $match: {
          user: { $in: userIds },
          success: true,
        },
      },
      {
        $group: {
          _id: "$user",
          used: { $sum: "$calls" },
        },
      },
    ]);

    const usageMap = new Map(
      usageCounts.map((u) => [u._id.toString(), u.used]),
    );

    const resultUsers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      status: u.status,
      apiKeys: apiKeyMap.get(u._id.toString()) || 0,
      credits: u.credits || 0,
      usedCredits: usageMap.get(u._id.toString()) || 0,
      createdAt: u.createdAt,
    }));

    res.json({
      totalUser,
      meta: {
        total: totalUser,
        page,
        limit,
        totalPages: Math.ceil(totalUser / limit),
      },
      users: resultUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const { userId } = req.params;
    const { status } = req.body;
    
    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot update admin user status",
      });
    }

    user.status = status;
    await user.save();

    return res.json({
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while updating user status",
    });
  }
};

export const getCreditSalesAnalytics = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const now = new Date();
    const months = [...Array(12)]
      .map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          y: d.getFullYear(),
          m: d.getMonth() + 1,
          key: d.toLocaleString("default", { month: "short" }),
        };
      })
      .reverse();

    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);

        return {
          key: d.toLocaleString("default", { weekday: "short" }),
          date: d.toISOString().split("T")[0],
        };
      })
      .reverse();

    const [
      revenueAgg,
      creditsAgg,
      ordersCount,
      monthlyRevenueRaw,
      monthlyCreditsRaw,
      dailyCreditsRaw,
    ] = await Promise.all([
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),

      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$credits" } } },
      ]),

      Payment.countDocuments({ status: "paid" }),

      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
            },
            revenue: { $sum: "$price" },
          },
        },
      ]),

      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
            },
            credits: { $sum: "$credits" },
          },
        },
      ]),

      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
            },
            credits: { $sum: "$credits" },
          },
        },
      ]),
    ]);

    const revenueMap = new Map(
      monthlyRevenueRaw.map((r) => [`${r._id.y}-${r._id.m}`, r.revenue]),
    );

    const creditsMap = new Map(
      monthlyCreditsRaw.map((r) => [`${r._id.y}-${r._id.m}`, r.credits]),
    );

    const dailyMap = new Map(
      dailyCreditsRaw.map((d) => [d._id.date, d.credits]),
    );

    const revenueByMonth = months.map((m) => {
      const key = `${m.y}-${m.m}`;
      return {
        key: m.key,
        revenue: revenueMap.get(key) || 0,
      };
    });

    const creditsSaleByWeek = last7Days.map((d) => {
      return {
        key: d.key,
        credits: dailyMap.get(d.date) || 0,
      };
    });

    res.json({
      states: {
        totalRevenue: revenueAgg[0]?.total || 0,
        creditsSold: creditsAgg[0]?.total || 0,
        totalOrders: ordersCount,
      },

      revenueByMonth,
      creditsSaleByWeek,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Credit dashboard error",
    });
  }
};

export const getPaymentRecords = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "", status } = req.query;

    const matchStage = {};
    if (status) matchStage.status = status;
    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "user.name": { $regex: search, $options: "i" } },
                  { "user.email": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $facet: {
          metadata: [{ $count: "total" }],

          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
              $project: {
                _id: 1,
                credits: 1,
                price: 1,
                status: 1,
                createdAt: 1,
                name: "$user.name",
                email: "$user.email",
              },
            },
          ],
        },
      },
    ];

    const result = await Payment.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total || 0;
    const payments = result[0]?.data || [];

    res.json({
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payments fetch error" });
  }
};

export const getCreditLogsAnalytics = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const now = new Date();

    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);

        return {
          key: d.toLocaleString("default", { weekday: "short" }),
          date: d.toISOString().split("T")[0],
        };
      })
      .reverse();

    const [purchasedRaw, spentRaw, rewardRaw, apiUsageRaw] = await Promise.all([
      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            total: { $sum: "$credits" },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            spent: { $sum: "$calls" },
          },
        },
      ]),

      Reward.aggregate([
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            rewarded: { $sum: "$rewardCredits" },
          },
        },
      ]),

      ApiUsage.aggregate([
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              status: "$success",
            },
            count: { $sum: "$calls" },
          },
        },
      ]),
    ]);

    const purchaseMap = new Map(purchasedRaw.map((d) => [d._id.date, d.total]));
    const spentMap = new Map(spentRaw.map((d) => [d._id.date, d.spent]));
    const rewardMap = new Map(rewardRaw.map((d) => [d._id.date, d.rewarded]));

    const states = {
      creditsPurchased: purchasedRaw.reduce((s, d) => s + d.total, 0),
      creditsSpent: spentRaw.reduce((s, d) => s + d.spent, 0),
      creditsRewarded: rewardRaw.reduce((s, d) => s + d.rewarded, 0),
    };

    const apiUsage = last7Days.map((d) => {
      const dayData = apiUsageRaw.filter((x) => x._id.date === d.date);

      const success = dayData
        .filter((x) => x._id.status === true)
        .reduce((s, x) => s + x.count, 0);

      const fail = dayData
        .filter((x) => x._id.status === false)
        .reduce((s, x) => s + x.count, 0);

      const total = success + fail;

      return {
        key: d.key,
        total,
        success,
        fail,
      };
    });

    res.json({
      states,
      apiUsage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Credit logs dashboard error" });
  }
};

export const getCreditLogRecords = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "", success } = req.query;

    const match = {};

    if (success !== undefined) {
      match.success = success === "true";
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "apikeys",
          localField: "apiKey",
          foreignField: "_id",
          as: "apiKey",
          pipeline: [
            {
              $project: {
                key: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$apiKey" },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "user.name": { $regex: search, $options: "i" } },
                  { "user.email": { $regex: search, $options: "i" } },
                  { title: { $regex: search, $options: "i" } },
                  { useCase: { $regex: search, $options: "i" } },
                  { "apiKey.key": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $facet: {
          metadata: [{ $count: "total" }],

          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
              $project: {
                _id: 1,
                title: 1,
                useCase: 1,
                success: 1,
                date: 1,

                name: "$user.name",
                email: "$user.email",
                apiKey: "$apiKey.key",
              },
            },
          ],
        },
      },
    ];

    const result = await ApiUsage.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total || 0;
    const logs = result[0]?.data || [];

    res.json({
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Credit logs fetch error" });
  }
};

export const getApiKeyMonitoring = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const limit = parseInt(req.query.limit) || 5;
    const now = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(now.getDate() - 7);

    const [totalKeys, lastWeekKeys, totalRequestsAgg, topUsersRaw] =
      await Promise.all([
        Apikey.countDocuments(),

        Apikey.countDocuments({
          createdAt: { $gte: lastWeekDate },
        }),

        ApiUsage.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$calls" },
            },
          },
        ]),

        ApiUsage.aggregate([
          { $match: { success: true } },

          {
            $group: {
              _id: "$user",
              requests: { $sum: "$calls" },
            },
          },

          { $sort: { requests: -1 } },
          { $limit: limit },

          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
              pipeline: [{ $project: { name: 1 } }],
            },
          },
          { $unwind: "$user" },

          {
            $project: {
              _id: 0,
              key: "$user.name",
              requests: 1,
            },
          },
        ]),
      ]);

    res.json({
      states: {
        totalKeys,
        lastWeek: lastWeekKeys,
        totalRequests: totalRequestsAgg[0]?.total || 0,
      },
      requestsByOwner: topUsersRaw,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "API key monitoring error" });
  }
};

export const getApiKeyRecords = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "" } = req.query;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "user.name": { $regex: search, $options: "i" } },
                  { "user.email": { $regex: search, $options: "i" } },
                  { name: { $regex: search, $options: "i" } },
                  { key: { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $facet: {
          metadata: [{ $count: "total" }],

          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
              $project: {
                name: "$user.name",
                email: "$user.email",
                keyName: "$name",
                apiKey: "$key",
                keyCalles: 1,
                lastUsed: 1,
                apiCreatedAt: "$createdAt",
              },
            },
          ],
        },
      },
    ];

    const result = await Apikey.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total || 0;
    const keys = result[0]?.data || [];

    res.json({
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      keys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "API key records error" });
  }
};
