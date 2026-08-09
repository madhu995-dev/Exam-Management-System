import axiosInstance from './axiosConfig';

export const invigilatorApi = {
  // POST /api/invigilator-assignments
  assignInvigilator: async (requestDto) => {
    const response = await axiosInstance.post('/api/invigilator-assignments', requestDto);
    return response.data;
  },

  // GET /api/invigilator-assignments/exam/{examId}
  getAssignmentsByExam: async (examId) => {
    const response = await axiosInstance.get(`/api/invigilator-assignments/exam/${examId}`);
    return response.data;
  },

  // GET /api/invigilator-assignments/faculty/{facultyId}
  getAssignmentsByFaculty: async (facultyId) => {
    const response = await axiosInstance.get(`/api/invigilator-assignments/faculty/${facultyId}`);
    return response.data;
  },

  // GET /api/invigilator-assignments/room/{roomId}
  getAssignmentsByRoom: async (roomId) => {
    const response = await axiosInstance.get(`/api/invigilator-assignments/room/${roomId}`);
    return response.data;
  },

  // DELETE /api/invigilator-assignments/{assignmentId}
  deleteAssignment: async (assignmentId) => {
    const response = await axiosInstance.delete(`/api/invigilator-assignments/${assignmentId}`);
    return response.data;
  },
};
