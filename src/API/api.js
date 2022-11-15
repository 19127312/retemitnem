import axios from 'axios';


const api = axios.create({
    // baseURL: process.env.REACT_APP_URL_API,
    baseURL: "http://localhost:3000",
});

export const PATH = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GET_NEW_ACCESS_TOKEN: '/auth/access-token',
    GET_NEW_REFRESH_TOKEN: '/auth/refresh-token',
    GET_PROFILE: '/user/profile',
}

api.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},
    (error) => Promise.reject(error)
)


export const login = async ({ email, password }) => {
    try {
        const response = await api.post(PATH.LOGIN, { email, password });
        return response;
    } catch (error) {
        throw Error(error.response.data);
    }
}


export const signup = async ({ fullName, email, password }) => {
    try {
        const response = await api.post(PATH.REGISTER, { fullName, email, password });
        return response;
    } catch (error) {
        throw Error(error.response.data.error);
    }
}
export const getProfile = async () => {
    try {
        const response = await api.get(PATH.GET_PROFILE);
        return response;
    } catch (error) {
        throw Error(error.response.data);
    }
}

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
    }
};

