import api from "./api";

const PATH = {
  GET_PROFILE: "/user/profile",
  USER_INFO: "/user/info",
  UPDATE_USER_INFO: "/user/changeInfo",
  UPDATE_NAME: "/user/changename",
  UPDATE_PASSWORD: "/user/changepassword",
  CHECKTYPE: "/user/checkType",
};

export const getProfile = async () => {
  try {
    const response = await api.get(PATH.GET_PROFILE);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const userInfo = async ({ id }) => {
  try {
    const response = await api.get(PATH.USER_INFO, { id });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const changeFullname = async ({ userID, newName }) => {
  try {
    const response = await api.post(PATH.UPDATE_NAME, {
      userID,
      newName,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const changePassword = async ({ userID, oldPassword, newPassword }) => {
  try {
    const response = await api.post(PATH.UPDATE_PASSWORD, {
      userID,
      oldPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw Error(error);
  }
};

export const checkType = async ({ userID }) => {
  try {
    const response = await api.post(PATH.CHECKTYPE, { userID });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
