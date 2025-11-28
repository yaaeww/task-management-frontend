import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // CHECK AUTH
  const checkAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();

      if (token && userData) {
        try {
          await authService.verifyToken();
          setUser(userData); // valid
        } catch {
          authService.clearAuthData();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      authService.clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);

      authService.setAuthData(data.user, data.access_token);
      setUser(data.user);

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // REGISTER
  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    setIsLoading(true);

    try {
      const data = await authService.register(
        name,
        email,
        password,
        passwordConfirmation
      );

      authService.setAuthData(data.user, data.access_token);
      setUser(data.user);

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.errors ||
          err.response?.data?.message ||
          "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      setUser(null);
      authService.clearAuthData();

      await authService.logout();
    } catch {
      setUser(null);
      authService.clearAuthData();
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  return {
    user,
    isLoading,
    isLoggingOut,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
