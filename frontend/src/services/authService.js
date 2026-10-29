import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data; // ApiResponse<JwtResponse>
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data; // ApiResponse<UserProfileResponse>
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('learnrec_token');
    localStorage.removeItem('learnrec_refresh_token');
    localStorage.removeItem('learnrec_user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('learnrec_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('learnrec_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('learnrec_token');
  },

  isAdmin() {
    const user = this.getStoredUser();
    return user?.roles?.includes('ROLE_ADMIN') || false;
  }
};

export default authService;
