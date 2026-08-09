import axiosInstance from './axiosConfig';

export const resultApi = {
  // POST /api/results
  publishResult: async (requestDto) => {
    const response = await axiosInstance.post('/api/results', requestDto);
    return response.data;
  },

  // PUT /api/results/{resultId}
  updateResult: async (resultId, requestDto) => {
    const response = await axiosInstance.put(`/api/results/${resultId}`, requestDto);
    return response.data;
  },

  // GET /api/results/exam/{examId}/student/{studentId}
  getResult: async (examId, studentId) => {
    const response = await axiosInstance.get(`/api/results/exam/${examId}/student/${studentId}`);
    return response.data;
  },

  // GET /api/results/exam/{examId}
  getResultsByExam: async (examId) => {
    const response = await axiosInstance.get(`/api/results/exam/${examId}`);
    return response.data;
  },

  // GET /api/results/student/{studentId}
  getResultsByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/api/results/student/${studentId}`);
    return response.data;
  },

  // DELETE /api/results/{resultId}
  deleteResult: async (resultId) => {
    const response = await axiosInstance.delete(`/api/results/${resultId}`);
    return response.data;
  },
};
