// middlewares/apiKey.middleware.js
import ApiKey from "../models/apiKey.model.js";
import User from "../models/user.model.js";

export const verifyApiKey = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({
        success: false,
        message: "API key is required",
      });
    }

    const apiKeyDoc = await ApiKey.findOne({ key }).populate("createdBy");

    if (!apiKeyDoc) {
      return res.status(403).json({
        success: false,
        message: "Invalid API key",
      });
    }
    req.apiKey = apiKeyDoc;
    req.user = apiKeyDoc.createdBy;
    apiKeyDoc.lastUsed = new Date();
    apiKeyDoc.keyCalles += 1;
    await apiKeyDoc.save();

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
