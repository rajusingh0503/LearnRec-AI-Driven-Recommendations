import api from './api';

export const contentService = {
  async getAllContent(params = {}) {
    const response = await api.get('/content', { params });
    return response.data; // ApiResponse<PagedResponse<ContentResponse>>
  },

  async getContentById(id) {
    const response = await api.get(`/content/${id}`);
    return response.data; // ApiResponse<ContentResponse>
  },

  async getCategories() {
    const response = await api.get('/content/categories');
    return response.data; // ApiResponse<List<CategoryResponse>>
  },

  async getTags() {
    const response = await api.get('/content/tags');
    return response.data; // ApiResponse<List<TagResponse>>
  }
};

export default contentService;
