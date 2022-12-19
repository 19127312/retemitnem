import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
});

export const BASE_URL = {
  GET_IMAGES:
    "https://api.nasa.gov/planetary/apod?api_key=MKbBo8HveCvt4DHggM8VbUQQYbDspW6L9v5u5Le6",
};

export const refreshAccessToken = async () => {
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");
  try {
    if (refreshTokenFromStorage) {
      const response = await api.post("/auth/access-token", {
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

export default api;
