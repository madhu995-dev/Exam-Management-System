import axiosInstance from './axiosConfig';

export const subjectApi = {
  // GET /api/subjects
  getAllSubjects: async () => {
    const response = await axiosInstance.get('/api/subjects');
    return response.data;
  },

  // GET /api/subjects/{id}
  getSubjectById: async (id) => {
    const response = await axiosInstance.get(`/api/subjects/${id}`);
    return response.data;
  },

  // POST /api/subjects
  createSubject: async (subjectRequestDto) => {
    const response = await axiosInstance.post('/api/subjects', subjectRequestDto);
    return response.data;
  },

  // PUT /api/subjects/{id}
  updateSubject: async (id, subjectRequestDto) => {
    const response = await axiosInstance.put(`/api/subjects/${id}`, subjectRequestDto);
    return response.data;
  },

  // DELETE /api/subjects/{id}
  deleteSubject: async (id) => {
    const response = await axiosInstance.delete(`/api/subjects/${id}`);
    return response.data;
  },
};
