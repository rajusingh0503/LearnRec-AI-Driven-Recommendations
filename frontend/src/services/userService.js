import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data; // ApiResponse<UserProfileResponse>
  },

  async updateProfile(fullName) {
    const response = await api.put('/users/profile', null, {
      params: { fullName }
    });
    return response.data;
  },

  async getPreferences() {
    const response = await api.get('/users/preferences');
    return response.data; // ApiResponse<UserPreferenceResponse>
  },

  async updatePreferences(preferences) {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  }
};

export default userService;
