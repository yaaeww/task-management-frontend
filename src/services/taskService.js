import api from "./api";

export const taskService = {
  async getAllTasks() {
    const response = await api.get("/tasks");
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await api.put(`/tasks/${id}`, { status });
    return response.data;
  },
};