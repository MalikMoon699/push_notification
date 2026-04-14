import API from "../utils/api";

// DashBoard
export const getDashBoardData = async () => {
  try {
    const res = await API.get("/api/v1/admin/dashboard");
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Users
export const getUsersRecords = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await API.get("/api/v1/admin/get-users", {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateUsersStatus = async ({ userId, status }) => {
  try {
    const res = await API.patch(`/api/v1/admin/update-user-status/${userId}`, {
      status,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// CreditSales
export const getPaymentsAnalytics = async () => {
  try {
    const res = await API.get("/api/v1/admin/get-payment-analytics");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getPaymentRecords = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await API.get("/api/v1/admin/get-payment-records", {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// CreditLogs
export const getLogsAnalytics = async () => {
  try {
    const res = await API.get("/api/v1/admin/get-log-analytics");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getLogRecords = async ({
  page = 1,
  limit = 20,
  search = "",
  success = "",
} = {}) => {
  try {
    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(success && { success }),
    };

    const res = await API.get("/api/v1/admin/get-log-records", {
      params,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

// APIKeys
export const getApiMonitoring = async (limit = 20) => {
  try {
    const res = await API.get("/api/v1/admin/get-api-monitoring", {
      params: { limit },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getApiRecords = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  try {
    const res = await API.get("/api/v1/admin/get-api-records", {
      params: { page, limit, search },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
