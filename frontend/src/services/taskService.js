import api from './api';

export const taskService = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  restoreTask: (id) => api.patch(`/tasks/${id}/restore`),
  bulkAction: (data) => api.patch('/tasks/bulk', data),
  toggleStatus: (id, currentStatus) =>
    api.put(`/tasks/${id}`, { status: currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING' }),
};

export default taskService;
