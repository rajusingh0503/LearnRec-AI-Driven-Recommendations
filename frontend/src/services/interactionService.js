import api from './api';

export const interactionService = {
  async recordInteraction(data) {
    const response = await api.post('/interactions', data);
    return response.data; // ApiResponse<InteractionResponse>
  },

  async getHistory() {
    const response = await api.get('/interactions/history');
    return response.data; // ApiResponse<List<InteractionResponse>>
  },

  async getBookmarks() {
    const response = await api.get('/interactions/bookmarks');
    return response.data; // ApiResponse<List<InteractionResponse>>
  },

  async removeInteraction(id) {
    const response = await api.delete(`/interactions/${id}`);
    return response.data;
  }
};

export default interactionService;
