import { useState, useEffect } from "react";
import { authService } from "../services/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();

      if (token && userData) {
        setUser(userData);
        console.log("✅ User authenticated:", userData.name);
      } else {
        setUser(null);
        console.log("❌ No user authenticated");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("🔄 Attempting login...");
      const data = await authService.login(email, password);
      authService.setAuthData(data.user, data.access_token);
      setUser(data.user);
      console.log("✅ Login successful:", data.user.name);
      return { success: true, data };
    } catch (error) {
      console.error("❌ Login failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      console.log("🔄 Attempting registration...");
      const data = await authService.register(
        name,
        email,
        password,
        passwordConfirmation
      );
      authService.setAuthData(data.user, data.access_token);
      setUser(data.user);
      console.log("✅ Registration successful:", data.user.name);
      return { success: true, data };
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const errorMessage =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Registration failed";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      console.log("🔄 Attempting logout...");
      await authService.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      authService.clearAuthData();
      setUser(null);
      console.log("✅ Auth data cleared");
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
