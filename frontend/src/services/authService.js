import api from "../config/api.js";

export const authService = {
  async signup(userData) {
    try {
      const response = await api.post("/auth/signup", userData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data._id,
            username: response.data.username,
            email: response.data.email,
          })
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  async signin(credentials) {
    try {
      const response = await api.post("/auth/signin", credentials);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data._id,
            username: response.data.username,
            email: response.data.email,
          })
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
