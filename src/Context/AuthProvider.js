import { useEffect, createContext, useState, useMemo } from "react";
import { getProfile } from "../API/api";

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
      if (accessToken) {
        try {
          const response = await getProfile();
          const { user } = response.data;
          setAuth({ user, accessToken });
        } catch (error) {
          console.log("accessToken is expired");
          localStorage.removeItem("accessToken");
        }
      }
    }
    getProfileUser();
  }, []);
  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
