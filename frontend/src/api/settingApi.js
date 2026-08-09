import axiosInstance from './axiosConfig';

export const settingApi = {
  // GET /api/settings
  getAllSettings: async () => {
    const response = await axiosInstance.get('/api/settings');
    return response.data;
  },

  // GET /api/settings/{id}
  getSettingById: async (id) => {
    const response = await axiosInstance.get(`/api/settings/${id}`);
    return response.data;
  },

  // GET /api/settings/key/{settingKey}
  getSettingByKey: async (settingKey) => {
    const response = await axiosInstance.get(`/api/settings/key/${settingKey}`);
    return response.data;
  },

  // POST /api/settings
  createSetting: async (requestDto) => {
    const response = await axiosInstance.post('/api/settings', requestDto);
    return response.data;
  },

  // PUT /api/settings/{id}
  updateSetting: async (id, requestDto) => {
    const response = await axiosInstance.put(`/api/settings/${id}`, requestDto);
    return response.data;
  },

  // DELETE /api/settings/{id}
  deleteSetting: async (id) => {
    const response = await axiosInstance.delete(`/api/settings/${id}`);
    return response.data;
  },
};
