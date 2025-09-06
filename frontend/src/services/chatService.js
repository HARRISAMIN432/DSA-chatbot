import api from "../config/api.js";

export const chatService = {
  async sendMessage(message, topic = null) {
    try {
      const response = await api.post("/chat", { message, topic });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  async getMessages(topic = null, page = 1, limit = 15) {
    try {
      const params = { page, limit };
      if (topic) params.topic = topic;

      const response = await api.get("/chat/messages", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  async getTopics() {
    try {
      const response = await api.get("/chat/topics");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },
};
