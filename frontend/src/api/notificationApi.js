import axiosInstance from './axiosConfig';

export const notificationApi = {
  // POST /api/notifications
  createNotification: async (requestDto) => {
    const response = await axiosInstance.post('/api/notifications', requestDto);
    return response.data;
  },

  // GET /api/notifications/user/{userId}
  getUserNotifications: async (userId) => {
    const response = await axiosInstance.get(`/api/notifications/user/${userId}`);
    return response.data;
  },

  // GET /api/notifications/user/{userId}/unread
  getUnreadNotifications: async (userId) => {
    const response = await axiosInstance.get(`/api/notifications/user/${userId}/unread`);
    return response.data;
  },

  // GET /api/notifications/user/{userId}/count
  getUnreadCount: async (userId) => {
    const response = await axiosInstance.get(`/api/notifications/user/${userId}/count`);
    return response.data;
  },

  // PUT /api/notifications/{notificationId}/read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  // PUT /api/notifications/user/{userId}/read-all
  markAllAsRead: async (userId) => {
    const response = await axiosInstance.put(`/api/notifications/user/${userId}/read-all`);
    return response.data;
  },

  // DELETE /api/notifications/{notificationId}
  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },
};
