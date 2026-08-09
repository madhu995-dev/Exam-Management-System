import axiosInstance from './axiosConfig';

export const examApi = {
  // GET /api/exams
  getAllExams: async () => {
    const response = await axiosInstance.get('/api/exams');
    return response.data;
  },

  // GET /api/exams/{id}
  getExamById: async (id) => {
    const response = await axiosInstance.get(`/api/exams/${id}`);
    return response.data;
  },

  // POST /api/exams
  createExam: async (requestDto) => {
    const response = await axiosInstance.post('/api/exams', requestDto);
    return response.data;
  },

  // PUT /api/exams/{id}
  updateExam: async (id, requestDto) => {
    const response = await axiosInstance.put(`/api/exams/${id}`, requestDto);
    return response.data;
  },

  // DELETE /api/exams/{id}
  deleteExam: async (id) => {
    const response = await axiosInstance.delete(`/api/exams/${id}`);
    return response.data;
  },
};
