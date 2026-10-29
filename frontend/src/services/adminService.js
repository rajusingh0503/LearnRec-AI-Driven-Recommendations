import api from './api';

export const adminService = {
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data; // ApiResponse<List<UserProfileResponse>>
  },

  async createContent(contentData) {
    const response = await api.post('/admin/content', contentData);
    return response.data; // ApiResponse<ContentResponse>
  },

  async updateContent(id, contentData) {
    const response = await api.put(`/admin/content/${id}`, contentData);
    return response.data;
  },

  async deleteContent(id) {
    const response = await api.delete(`/admin/content/${id}`);
    return response.data;
  },

  async getAllSettings() {
    const response = await api.get('/admin/settings');
    return response.data; // ApiResponse<List<SystemSettingResponse>>
  },

  async updateSetting(key, settingValue) {
    const response = await api.put(`/admin/settings/${key}`, { settingValue });
    return response.data;
  },

  async getAnalyticsSummary() {
    const response = await api.get('/admin/analytics/summary');
    return response.data; // ApiResponse<AnalyticsSummaryResponse>
  }
};

export default adminService;
