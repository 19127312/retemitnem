import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
});

export const PATH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_NEW_ACCESS_TOKEN: "/auth/access-token",
  GET_NEW_REFRESH_TOKEN: "/auth/refresh-token",
  GET_PROFILE: "/user/profile",
  GOOGLE_LOGIN: "/auth/google_login",
  GOOGLE_SIGNUP: "/auth/google_signup",
  CREATE_GROUP: "/group/add",
  GROUP_INFO: "/group/info",
  USER_INFO: "/user/info",
  CHANGE_ROLE: "/group/role",
  GROUP_DETAIL: "/group/detail",
  DELETE_MEMBER: "/group/deletemember",
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async ({ email, password }) => {
  try {
    const response = await api.post(PATH.LOGIN, { email, password });
    return response;
  } catch (error) {
    console.log(error);
    throw Error(error.response.data.message);
  }
};
export const loginGG = async (token) => {
  try {
    const response = await api.post(PATH.GOOGLE_LOGIN, {
      token,
    });
    return response;
  } catch (error) {
    throw Error(error);
  }
};
export const signupGG = async (token) => {
  try {
    const response = await api.post(PATH.GOOGLE_SIGNUP, {
      token,
    });
    return response;
  } catch (error) {
    throw Error(error);
  }
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
export const getProfile = async () => {
  try {
    const response = await api.get(PATH.GET_PROFILE);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const refreshAccessToken = async () => {
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");
  try {
    const response = await api.post(PATH.GET_NEW_ACCESS_TOKEN, {
      refreshToken: refreshTokenFromStorage,
    });
    const { accessToken } = response.data;
    return accessToken;
  } catch (error) {
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export const createGroup = async ({ groupName, creatorID }) => {
  try {
    const response = await api.post(PATH.CREATE_GROUP, {
      groupName,
      creatorID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const groupInfo = async () => {
  try {
    const response = await api.get(PATH.GROUP_INFO);
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

export const changeRole = async ({ groupID, memberID, role }) => {
  try {
    const response = await api.post(PATH.CHANGE_ROLE, {
      groupID,
      memberID,
      role,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewGroupInfo = async ({ groupID }) => {
  try {
    const respone = await api.get(`${PATH.GROUP_DETAIL}/${groupID}`);
    return respone;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const deleteMember = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.DELETE_MEMBER, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
