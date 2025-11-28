import api from "./api";

export const authService = {
  async login(email, password) {
    console.log("🔐 Attempting login...");
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(name, email, password, password_confirmation) {
    console.log("🔐 Attempting registration...");
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  },

  async logout() {
    console.log("🔐 Attempting logout...");
    const response = await api.post("/logout");
    return response.data;
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  setAuthData(user, token) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },

  clearAuthData() {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};
