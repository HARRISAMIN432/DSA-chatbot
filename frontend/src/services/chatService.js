import api from "../config/api.js";

export const chatService = {
  sendMessage: async (message, topic) => {
    const response = await api.post("/chat", {
      message,
      topic,
    });
    return response.data;
  },

  getMessages: async (topic, page = 1, limit = 15) => {
    const params = new URLSearchParams();
    if (topic) params.append("topic", topic);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await api.get(`/chat/messages?${params.toString()}`);
    return response.data;
  },

  getTopics: async () => {
    const response = await api.get("/chat/topics");
    return response.data;
  },

  deleteTopic: async (topic) => {
    const response = await api.delete(
      `/chat/topics/${encodeURIComponent(topic)}`
    );
    return response.data;
  },
};
