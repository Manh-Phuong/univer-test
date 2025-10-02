import { useState } from "react";
import { authApi } from "../api/auth.api";
import { storage } from "../utils/storage";
import { handleApiError } from "../api/client";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage
    const storedUser = storage.getUser();
    console.log("useAuth initialized with user:", storedUser);
    return storedUser;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting login for:", email);
      const response = await authApi.login(email, password);
      console.log("Login API response:", response);

      // Save to localStorage
      storage.setToken(response.token);
      storage.setUser(response.user);
      console.log("Saved to localStorage");

      // Update state - THIS IS CRITICAL
      setUser(response.user);
      console.log("Updated user state:", response.user);

      return { success: true };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      console.error("Login error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.register(email, password, name);

      storage.setToken(response.token);
      storage.setUser(response.user);
      setUser(response.user);

      return { success: true };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    storage.clear();
    setUser(null);
    console.log("User cleared");
  };

  const isAuthenticated = !!user;
  console.log("useAuth render - isAuthenticated:", isAuthenticated, "user:", user);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
};