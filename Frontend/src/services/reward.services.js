import API from "../utils/api";

export const claimDailyRewardHelper = async () => {
  try {
    const res = await API.get("/api/rewards/claim-today-reward");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const claimFirstLoginRewardHelper = async () => {
  try {
    const res = await API.get("/api/rewards/claim-first-login-reward");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getRewardRecordsHelper = async (
  page = 1,
  limit = 20,
) => {
  try {
    const res = await API.get("/api/rewards/get-reward-history", {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};
