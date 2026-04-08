import ApiUsage from "../models/apiUsage.model.js";

export const logApiUsage = async ({ apiKeyId, userId, useCase, success }) => {
  try {
    await ApiUsage.create({
      apiKey: apiKeyId,
      user: userId,
      useCase,
      success,
      date: new Date(),
      calls: 1,
    });
  } catch (err) {
    console.error("Usage logging failed:", err);
  }
};