import ApiUsage from "../models/apiUsage.model.js";

export const logApiUsage = async ({ apiKeyId, userId, title, useCase, success }) => {
  try {
    await ApiUsage.create({
      apiKey: apiKeyId,
      user: userId,
      title,
      useCase,
      success,
      date: new Date(),
      calls: 1,
    });
  } catch (err) {
    console.error("Usage logging failed:", err);
  }
};