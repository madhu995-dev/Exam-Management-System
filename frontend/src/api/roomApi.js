import axiosInstance from './axiosConfig';

export const roomApi = {
  // GET /api/rooms
  getAllRooms: async () => {
    const response = await axiosInstance.get('/api/rooms');
    return response.data;
  },

  // GET /api/rooms/{id}
  getRoomById: async (id) => {
    const response = await axiosInstance.get(`/api/rooms/${id}`);
    return response.data;
  },

  // POST /api/rooms
  createRoom: async (roomRequestDto) => {
    const response = await axiosInstance.post('/api/rooms', roomRequestDto);
    return response.data;
  },

  // PUT /api/rooms/{id}
  updateRoom: async (id, roomRequestDto) => {
    const response = await axiosInstance.put(`/api/rooms/${id}`, roomRequestDto);
    return response.data;
  },

  // DELETE /api/rooms/{id}
  deleteRoom: async (id) => {
    const response = await axiosInstance.delete(`/api/rooms/${id}`);
    return response.data;
  },
};
