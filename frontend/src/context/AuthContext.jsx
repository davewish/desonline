import React, { createContext, useState, useCallback, useEffect } from "react";
import { storage } from "../utils/storage";

/**
 * Auth Context for managing user authentication state
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize token from storage on mount
  useEffect(() => {
    const storedToken = storage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Verify token is still valid
      getUserProfile(storedToken);
    }
    setLoading(false);
  }, []);

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
      if (data.success) {
        setUser(data.data);
      } else {
        setToken(null);
        storage.removeItem("token");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, []);

  const login = useCallback((newToken, userData) => {
    console.info(
      "[AUTH] User logged in:",
      userData.email,
      "Role:",
      userData.role,
    );
    setToken(newToken);
    setUser(userData);
    storage.setItem("token", newToken);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    console.info("[AUTH] User logged out");
    setToken(null);
    setUser(null);
    storage.removeItem("token");
    setError(null);
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
    isAuthenticated: !!token,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
