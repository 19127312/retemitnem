import { useEffect, createContext, useState, useMemo } from "react";
import { getProfile, refreshAccessToken } from "../API/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, accessToken: null });
  useEffect(() => {
    if (auth?.accessToken) {
      localStorage.setItem("accessToken", auth.accessToken);
    }
    if (auth?.refreshToken) {
      localStorage.setItem("refreshToken", auth.refreshToken);
    }
  }, [auth]);

  useEffect(() => {
    async function getProfileUser() {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        try {
          const response = await getProfile();
          const { user } = response.data;
          setAuth({ user, accessToken });
        } catch (error) {
          console.log("accessToken is expired");
          localStorage.removeItem("accessToken");
          if (refreshToken) {
            try {
              const newAccessToken = await refreshAccessToken();
              localStorage.setItem("accessToken", newAccessToken);
              const newResponse = await getProfile();
              const { user } = newResponse.data;
              setAuth({ user, accessToken: newAccessToken, refreshToken });
            } catch (e) {
              console.log("refreshToken is expired");
              localStorage.removeItem("refreshToken");
            }
          }
        }
      }
    }
    getProfileUser();
  }, []);
  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
