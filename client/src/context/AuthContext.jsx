import { createContext, useState, useEffect } from "react";
import * as api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    api
      .getProfile()
      .then((result) => {
        const currentUser = result.data?.user;
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.loginUser(credentials);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const result = await api.registerUser(payload);
    return result;
  };

  const logout = () => {
    api.logoutUser().catch(() => {});
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
