import axiosInstance from './axiosConfig';

export const seatAllocationApi = {
  // POST /api/seat-allocations/{examId}/allocate
  allocateSeats: async (examId) => {
    const response = await axiosInstance.post(`/api/seat-allocations/${examId}/allocate`);
    return response.data;
  },

  // GET /api/seat-allocations/exam/{examId}
  getAllocationByExam: async (examId) => {
    const response = await axiosInstance.get(`/api/seat-allocations/exam/${examId}`);
    return response.data;
  },

  // GET /api/seat-allocations/student/{studentId}
  getAllocationByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/api/seat-allocations/student/${studentId}`);
    return response.data;
  },

  // DELETE /api/seat-allocations/exam/{examId}
  deleteAllocation: async (examId) => {
    const response = await axiosInstance.delete(`/api/seat-allocations/exam/${examId}`);
    return response.data;
  },
};
