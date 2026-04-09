import API from "../utils/api";

export const genApiKey = async (name) => {
  try {
    const res = await API.post("/api/v1/key/gen", { name });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getApiKeys = async () => {
  try {
    const res = await API.get("/api/v1/key/get-keys");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const deleteApiKeys = async (id) => {
  try {
    const res = await API.delete(`/api/v1/key/del-key/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getApiUsage = async () => {
  try {
    const res = await API.get("/api/v1/key/api-usage");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getApiUsageStates = async ({ date, month }) => {
  try {
    const res = await API.get("/api/v1/key/api-usage-states", {
      params: { date, month },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};