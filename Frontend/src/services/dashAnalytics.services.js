import API from "../utils/api";

export const getDashBoardData = async () => {
  try {
    const res = await API.get("/api/dashAnalytic/get-dash-data");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getAnalyticsData = async () => {
  try {
    const res = await API.get("/api/dashAnalytic/get-anal-data");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getApiRequestCount = async () => {
  try {
    const res = await API.get("/api/dashAnalytic/get-api-request-count");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};
