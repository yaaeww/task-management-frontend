import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// ✅ PERBAIKI: Gunakan key yang konsisten
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // ✅ GANTI 'token' -> 'access_token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ PERBAIKI: Hapus dengan key yang benar
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    
    // ✅ DEBUG: Log response untuk memastikan
    console.log('🔑 Login Response:', response.data);
    
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
    try {
      const response = await api.post('/logout');
      return response.data;
    } finally {
      // Pastikan data dihapus bahkan jika request gagal
      this.clearAuthData();
    }
  },

  async verifyToken() {
    const response = await api.get('/user');
    return response.data;
  },

  // ✅ PERBAIKI: Gunakan key yang konsisten
  getToken() {
    return localStorage.getItem('access_token'); // ✅ GANTI
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuthData(user, token) {
    // ✅ PERBAIKI: Simpan dengan key yang konsisten
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token); // ✅ GANTI
  },

  clearAuthData() {
    // ✅ PERBAIKI: Hapus dengan key yang benar
    localStorage.removeItem('user');
    localStorage.removeItem('access_token'); // ✅ GANTI
  }
};