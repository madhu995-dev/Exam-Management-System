import axiosInstance from './axiosConfig';

export const dashboardApi = {
  // GET /api/dashboard/admin
  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/api/dashboard/admin');
    return response.data;
  },
};
