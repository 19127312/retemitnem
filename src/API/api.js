import axios from "axios";
// import createAuthRefreshInterceptor from "axios-auth-refresh";

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
  CREATE_GROUP: "/group/add",
  GROUP_INFO: "/group/info",
  USER_INFO: "/user/info",
  CHANGE_ROLE: "/group/role",
  SEND_LINK_TO_EMAIL: "/group/sendlinktoemail",
  GROUP_DETAIL: "/group/detail",
  DELETE_MEMBER: "/group/deletemember",
  ADD_MEMBER: "/group/addmember",
  UPDATE_USER_INFO: "/user/changeInfo",
  UPDATE_NAME: "/user/changename",
  UPDATE_PASSWORD: "/user/changepassword",
  LOGOUT: "/auth/logout",
  CHECKTYPE: "/user/checkType",
  PRESENTATION_INFO: "presentation/viewByGroupID",
  PRESENTATION_INFO_BY_ID: "presentation/info",
  UPDATE_PRESENTATION: "presentation/update",
  CREATE_PRESENTATION: "/presentation/add",
  DELETE_PRESENTATIONS: "/presentation/delete",
  CHECK_MEMBER_IN_GROUP: "/group/check",
  INIT_CHAT: "/chat",
  MORE_CHAT: "/chat/more",
};
export const BASE_URL = {
  GET_IMAGES:
    "https://api.nasa.gov/planetary/apod?api_key=MKbBo8HveCvt4DHggM8VbUQQYbDspW6L9v5u5Le6",
};

export const refreshAccessToken = async () => {
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");
  try {
    if (refreshTokenFromStorage) {
      const response = await api.post(PATH.GET_NEW_ACCESS_TOKEN, {
        refreshToken: refreshTokenFromStorage,
      });
      const { accessToken } = response.data;
      return accessToken;
    }
    return null;
  } catch (error) {
    localStorage.removeItem("refreshToken");
    return null;
  }
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403) {
      const config = error?.config;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${newAccessToken}`,
        };
      }
      return axios(config);
    }
    return Promise.reject(error);
  }
);

export const login = async ({ email, password }) => {
  try {
    const response = await api.post(PATH.LOGIN, { email, password });
    return response;
  } catch (error) {
    throw Error(error.response.data.message);
  }
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

export const sendlinktoemail = async ({ groupID, emailList }) => {
  try {
    const response = await api.post(PATH.SEND_LINK_TO_EMAIL, {
      groupID,
      emailList,
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

export const addMember = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.ADD_MEMBER, {
      groupID,
      memberID,
    });
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

export const checkType = async ({ userID }) => {
  try {
    const response = await api.post(PATH.CHECKTYPE, { userID });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewPresentationInfoByGroupID = async ({ groupID }) => {
  try {
    const response = await api.get(`${PATH.PRESENTATION_INFO}/${groupID}`);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewPresentationInfoByPresentationID = async ({
  presentationID,
}) => {
  try {
    const response = await api.get(
      `${PATH.PRESENTATION_INFO_BY_ID}/${presentationID}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw Error(error.response.data.errorMessage);
  }
};

export const updatePresentation = async ({ presentation }) => {
  try {
    const response = await api.post(PATH.UPDATE_PRESENTATION, { presentation });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const createPresentation = async ({ title, ownerID, groupID }) => {
  try {
    const response = await api.post(PATH.CREATE_PRESENTATION, {
      title,
      ownerID,
      groupID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const deletePresentations = async ({ presentationIDs }) => {
  try {
    const response = await api.post(PATH.DELETE_PRESENTATIONS, {
      presentationIDs,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const getRandomImagesUrl = async (quantity) => {
  try {
    const imageUrlArray = [];
    fetch(`${BASE_URL.GET_IMAGES}&count=${quantity}`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          imageUrlArray.push(data[i].url);
        }
      });
    return imageUrlArray;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const checkMemberInGroup = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.CHECK_MEMBER_IN_GROUP, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const getChatHistoryInit = async ({ presentationID }) => {
  try {
    const response = await api.get(`${PATH.INIT_CHAT}/${presentationID}`);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const getMoreChat = async ({ presentationID, lastChatID }) => {
  try {
    const response = await api.post(PATH.getMoreChat, {
      presentationID,
      lastChatID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
