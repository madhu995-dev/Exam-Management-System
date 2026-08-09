import axiosInstance from './axiosConfig';

export const facultyApi = {
  // GET /api/faculties
  getAllFaculties: async () => {
    const response = await axiosInstance.get('/api/faculties');
    return response.data;
  },

  // GET /api/faculties/{id}
  getFacultyById: async (id) => {
    const response = await axiosInstance.get(`/api/faculties/${id}`);
    return response.data;
  },

  // POST /api/faculties
  createFaculty: async (facultyRequestDto) => {
    const response = await axiosInstance.post('/api/faculties', facultyRequestDto);
    return response.data;
  },

  // PUT /api/faculties/{id}
  updateFaculty: async (id, facultyRequestDto) => {
    const response = await axiosInstance.put(`/api/faculties/${id}`, facultyRequestDto);
    return response.data;
  },

  // DELETE /api/faculties/{id}
  deleteFaculty: async (id) => {
    const response = await axiosInstance.delete(`/api/faculties/${id}`);
    return response.data;
  },
};
