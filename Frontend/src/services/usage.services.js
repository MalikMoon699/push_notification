import API from "../utils/api";

export const getUsageStatesHelper = async () => {
  try {
    const res = await API.get("/api/usage/get-states");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getUsageRecordsHelper = async (
  page = 1,
  limit = 20,
  search = "",
  status = "",
) => {
  try {
    const res = await API.get("/api/usage/get-records", {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const statesData = {
  success: 7,
  fail: 2,
  creditsUsed: 7,
};

export const usageDetails = [
  {
    _id: "69d65754930b79fef9a5e916",
    apiKey: "69d64fde26ef200dd5c04d87",
    user: "69d5088d8d35d8021359df58",
    useCase: "Device token generated",
    success: true,
    date: "2026-04-08T13:25:40.012+00:00",
    calls: 1,
    createdAt: "2026-04-08T13:25:40.014+00:00",
    updatedAt: "2026-04-08T13:25:40.014+00:00",
  },
  {
    _id: "69d65754930b79fef9a5e91b",
    apiKey: "69d64fde26ef200dd5c04d87",
    user: "69d5088d8d35d8021359df58",
    useCase: "Error while sending notification",
    success: false,
    date: "2026-04-08T13:25:40.328+00:00",
    calls: 1,
    createdAt: "2026-04-08T13:25:40.328+00:00",
    updatedAt: "2026-04-08T13:25:40.328+00:00",
  },
  {
    id: "69d657de0c0de6ed697357ae",
    apiKey: "69d64fde26ef200dd5c04d87",
    user: "69d5088d8d35d8021359df58",
    useCase: "Device token generated",
    success: true,
    date: "2026-04-08T13:27:58.389+00:00",
    calls: 1,
    createdAt: "2026-04-08T13:27:58.392+00:00",
    updatedAt: "2026-04-08T13:27:58.392+00:00",
  },
];
