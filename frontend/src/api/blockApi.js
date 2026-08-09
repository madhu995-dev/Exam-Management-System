import axiosInstance from './axiosConfig';

export const blockApi = {
  // GET /api/blocks
  getAllBlocks: async () => {
    const response = await axiosInstance.get('/api/blocks');
    return response.data;
  },

  // GET /api/blocks/{id}
  getBlockById: async (id) => {
    const response = await axiosInstance.get(`/api/blocks/${id}`);
    return response.data;
  },

  // POST /api/blocks
  createBlock: async (blockRequestDto) => {
    const response = await axiosInstance.post('/api/blocks', blockRequestDto);
    return response.data;
  },

  // PUT /api/blocks/{id}
  updateBlock: async (id, blockRequestDto) => {
    const response = await axiosInstance.put(`/api/blocks/${id}`, blockRequestDto);
    return response.data;
  },

  // DELETE /api/blocks/{id}
  deleteBlock: async (id) => {
    const response = await axiosInstance.delete(`/api/blocks/${id}`);
    return response.data;
  },
};
