import axiosInstance from './axiosConfig';

export const seriesApi = {
  // GET /api/examination-series
  getAllSeries: async () => {
    const response = await axiosInstance.get('/api/examination-series');
    return response.data;
  },

  // GET /api/examination-series/{id}
  getSeriesById: async (id) => {
    const response = await axiosInstance.get(`/api/examination-series/${id}`);
    return response.data;
  },

  // POST /api/examination-series
  createSeries: async (requestDto) => {
    const response = await axiosInstance.post('/api/examination-series', requestDto);
    return response.data;
  },

  // PUT /api/examination-series/{id}
  updateSeries: async (id, requestDto) => {
    const response = await axiosInstance.put(`/api/examination-series/${id}`, requestDto);
    return response.data;
  },

  // DELETE /api/examination-series/{id}
  deleteSeries: async (id) => {
    const response = await axiosInstance.delete(`/api/examination-series/${id}`);
    return response.data;
  },
};
