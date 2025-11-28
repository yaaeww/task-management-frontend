import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async register(name, email, password, password_confirmation) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/user');
    return response.data;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuthData(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};