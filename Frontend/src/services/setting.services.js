import API from "../utils/api";

export const UpdateProfileHelper = async (userId, formData) => {
  try {
    const res = await API.patch(`/api/auth/${userId}`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const updatePasswordHelper = async (userId, formData) => {
  try {
    const res = await API.patch(`/api/auth/updatePassword/${userId}`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};