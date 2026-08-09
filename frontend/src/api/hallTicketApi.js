import axiosInstance from './axiosConfig';

export const hallTicketApi = {
  // POST /api/hall-tickets/generate/{examId}/student/{studentId}
  generateHallTicket: async (examId, studentId) => {
    const response = await axiosInstance.post(`/api/hall-tickets/generate/${examId}/student/${studentId}`);
    return response.data;
  },

  // POST /api/hall-tickets/generate/{examId}
  generateHallTickets: async (examId) => {
    const response = await axiosInstance.post(`/api/hall-tickets/generate/${examId}`);
    return response.data;
  },

  // GET /api/hall-tickets/exam/{examId}
  getHallTicketsByExam: async (examId) => {
    const response = await axiosInstance.get(`/api/hall-tickets/exam/${examId}`);
    return response.data;
  },

  // GET /api/hall-tickets/student/{studentId}
  getHallTicketsByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/api/hall-tickets/student/${studentId}`);
    return response.data;
  },

  // GET /api/hall-tickets/{hallTicketNumber}
  getHallTicket: async (hallTicketNumber) => {
    const response = await axiosInstance.get(`/api/hall-tickets/${hallTicketNumber}`);
    return response.data;
  },
};
