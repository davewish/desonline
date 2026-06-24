import React, { createContext, useState, useCallback, useEffect } from "react";
import { storage } from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserProfile = useCallback(async (authToken) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (data.success) {
        setUser(data.data);
        return true;
      }

      setUser(null);
      setToken(null);
      storage.removeItem("token");

      return false;
    } catch (err) {
      console.error("Profile fetch error:", err);

      setUser(null);
      setToken(null);
      storage.removeItem("token");

      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = storage.getItem("token");

        console.log("Stored token:", storedToken);

        if (storedToken) {
          setToken(storedToken);
          await getUserProfile(storedToken);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getUserProfile]);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    storage.setItem("token", newToken);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    storage.removeItem("token");
  }, []);

  const register = useCallback((userData) => {
    setUser(userData);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role?.toUpperCase() === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
