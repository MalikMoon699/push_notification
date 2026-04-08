import admin from "../utils/firebaseAdmin.js";
import User from "../models/user.model.js";
import ApiKey from "../models/apiKey.model.js";

export const getFcmTokken = async (req, res) => {
  try {
    let tokens = [];
    const { token } = req.body;
    if (token && !tokens.includes(token)) {
      tokens.push(token);
    }
    res.json({ success: true, token });
  } catch (err) {
    console.error("Failed to getFcm Tokken:", err);
    res.status(500).json({ message: err.message });
  }
};

export const sendNotification = async (req, res) => {
  const { title, body, fcmTokens, icon } = req.body;

  if (!fcmTokens || fcmTokens.length === 0) {
    return res.status(400).json({ error: "FCM tokens are required" });
  }

  try {
    const results = await Promise.all(
      fcmTokens.map((token) =>
        admin
          .messaging()
          .send({
            token,
            notification: { title, body, image: icon },
          })
          .catch((err) => ({ error: err.message })),
      ),
    );

    const successCount = results.filter((r) => !r.error).length;
    const failureCount = results.filter((r) => r.error).length;

    res.json({ success: true, successCount, failureCount, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFcmTokkenByCredits = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user?.id;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.accountType === "premiumUser") {
      return res.json({
        success: true,
        token,
        creditsUsed: 0,
        remainingCredits: "unlimited",
      });
    }

    if (user.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits to get token",
        upgradeUrl: "https://dev-push-notification.vercel.app/princing",
      });
    }

    user.credits -= 1;
    await user.save();

    return res.json({
      success: true,
      token,
      creditsUsed: 1,
      remainingCredits: user.credits,
    });
  } catch (err) {
    console.error("Failed to get FCM Token:", err);
    res.status(500).json({ message: err.message });
  }
};

export const sendNotificationByCredits = async (req, res) => {
  const { title, body, fcmTokens, icon } = req.body;
  const userId = req.user?.id;

  if (!fcmTokens || fcmTokens.length === 0) {
    return res.status(400).json({ error: "FCM tokens are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const uniqueTokens = [...new Set(fcmTokens)];
    let tokensToSend = uniqueTokens;

    if (user.accountType === "basicUser") {
      if (user.credits <= 0) {
        return res.status(403).json({
          success: false,
          message: "No credits available",
          upgradeUrl: "https://dev-push-notification.vercel.app/princing",
        });
      }

      tokensToSend = uniqueTokens.slice(0, user.credits);
    }

    const results = await Promise.all(
      tokensToSend.map((token) =>
        admin
          .messaging()
          .send({
            token,
            notification: {
              title,
              body,
              image: icon,
            },
          })
          .then(() => ({ success: true }))
          .catch((err) => ({ error: err.message })),
      ),
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => r.error).length;

    let creditsUsed = 0;

    if (user.accountType === "basicUser") {
      creditsUsed = successCount;

      user.credits -= creditsUsed;
      await user.save();
    }

    return res.json({
      success: true,
      totalRequested: uniqueTokens.length,
      totalSent: tokensToSend.length,
      successCount,
      failureCount,
      creditsUsed,
      remainingCredits:
        user.accountType === "basicUser" ? user.credits : "unlimited",
      note:
        uniqueTokens.length > tokensToSend.length
          ? "Some tokens were skipped due to low credits"
          : null,
      results,
    });
  } catch (err) {
    console.error("Notification Error:", err);
    res.status(500).json({ error: err.message });
  }
};