import axios from "axios";
import api from "./api";

const PATH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GOOGLE_LOGIN: "/auth/google_login",
  LOGOUT: "/auth/logout",
};

const getGoogleUserInfo = async (token) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const signup = async ({ fullName, email, password }) => {
  try {
    const response = await api.post(PATH.REGISTER, {
      fullName,
      email,
      password,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
export const login = async ({ email, password }) => {
  try {
    const response = await api.post(PATH.LOGIN, { email, password });
    return response;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const loginGG = async (token) => {
  try {
    const userInfo = await getGoogleUserInfo(token);
    const response = await api.post(PATH.GOOGLE_LOGIN, {
      userInfo,
    });
    return response;
  } catch (error) {
    throw Error(error);
  }
};
export const logout = async ({ refreshToken }) => {
  try {
    const response = await api.post(PATH.LOGOUT, {
      refreshToken,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
