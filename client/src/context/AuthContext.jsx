import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    if (token) {
      fetchAdminProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setAdmin(data.admin);
        localStorage.setItem("adminToken", data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    refreshProfile: fetchAdminProfile,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
