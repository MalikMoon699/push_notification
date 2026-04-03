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
