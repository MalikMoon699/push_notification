import admin from "../utils/firebaseAdmin.js";

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
  if (!fcmTokens || !fcmTokens.length)
    return res.status(400).json({ error: "FCM tokens are required" });
  try {
    const message = {
      notification: { title, body, image: icon },
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log("Firebase response:", response);

    res.status(200).json({
      success: true,
      response: {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      },
    });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};