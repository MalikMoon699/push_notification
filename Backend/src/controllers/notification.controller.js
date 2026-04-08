import admin from "../utils/firebaseAdmin.js";
import { logApiUsage } from "../services/logApiUsage.js";

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
    const user = req.user;
    const apiKey = req.apiKey;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.accountType === "premiumUser") {
      await logApiUsage({
        apiKeyId: apiKey._id,
        userId: user._id,
        useCase: "Device token generated",
        success: true,
      });
      return res.json({
        success: true,
        token,
        creditsUsed: 0,
        remainingCredits: "unlimited",
      });
    }

    if (user.credits <= 0) {
      await logApiUsage({
        apiKeyId: apiKey._id,
        userId: user._id,
        useCase: "Not enough credits to generate device token",
        success: false,
      });

      return res.status(403).json({
        success: false,
        message: "Not enough credits",
      });
    }

    user.credits -= 1;
    await user.save();

    await logApiUsage({
      apiKeyId: apiKey._id,
      userId: user._id,
      useCase: "Device token generated",
      success: true,
    });
    return res.json({
      success: true,
      token,
      creditsUsed: 1,
      remainingCredits: user.credits,
    });
  } catch (err) {
    await logApiUsage({
      apiKeyId: req.apiKey?._id,
      userId: req.user?._id,
      useCase: "Error while generating device token",
      success: false,
    });
    console.error("Failed:", err);
    res.status(500).json({ message: err.message });
  }
};

export const sendNotificationByCredits = async (req, res) => {
  const { title, body, fcmTokens, icon } = req.body;
  const user = req.user;
  const apiKey = req.apiKey;

  if (!fcmTokens || fcmTokens.length === 0) {
    await logApiUsage({
      apiKeyId: apiKey?._id,
      userId: user?._id,
      useCase: "FCM tokens missing",
      success: false,
    });

    return res.status(400).json({ error: "FCM tokens required" });
  }

  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const uniqueTokens = [...new Set(fcmTokens)];
    let tokensToSend = uniqueTokens;

    if (user.accountType === "basicUser") {
      if (user.credits <= 0) {
        await logApiUsage({
          apiKeyId: apiKey._id,
          userId: user._id,
          useCase: "Not enough credits to send notification",
          success: false,
        });

        return res.status(403).json({
          success: false,
          message: "No credits available",
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
            notification: { title, body, image: icon },
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

    await logApiUsage({
      apiKeyId: apiKey._id,
      userId: user._id,
      useCase: `Notification sent: ${successCount} success, ${failureCount} failed`,
      success: successCount > 0,
    });

    return res.json({
      success: true,
      totalRequested: uniqueTokens.length,
      totalSent: tokensToSend.length,
      successCount,
      failureCount,
      creditsUsed,
      remainingCredits:
        user.accountType === "basicUser" ? user.credits : "unlimited",
      results,
    });
  } catch (err) {
    await logApiUsage({
      apiKeyId: apiKey?._id,
      userId: user?._id,
      useCase: "Error while sending notification",
      success: false,
    });

    console.error("Notification Error:", err);
    res.status(500).json({ error: err.message });
  }
};