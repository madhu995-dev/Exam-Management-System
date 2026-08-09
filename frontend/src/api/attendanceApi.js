import axiosInstance from './axiosConfig';

export const attendanceApi = {
  // POST /api/attendance
  markAttendance: async (requestDto) => {
    const response = await axiosInstance.post('/api/attendance', requestDto);
    return response.data;
  },

  // PUT /api/attendance/{attendanceId}
  updateAttendance: async (attendanceId, requestDto) => {
    const response = await axiosInstance.put(`/api/attendance/${attendanceId}`, requestDto);
    return response.data;
  },

  // GET /api/attendance/exam/{examId}
  getAttendanceByExam: async (examId) => {
    const response = await axiosInstance.get(`/api/attendance/exam/${examId}`);
    return response.data;
  },

  // GET /api/attendance/student/{studentId}
  getAttendanceByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/api/attendance/student/${studentId}`);
    return response.data;
  },

  // GET /api/attendance/faculty/{facultyId}
  getAttendanceByFaculty: async (facultyId) => {
    const response = await axiosInstance.get(`/api/attendance/faculty/${facultyId}`);
    return response.data;
  },

  // GET /api/attendance/exam/{examId}/present
  getPresentStudents: async (examId) => {
    const response = await axiosInstance.get(`/api/attendance/exam/${examId}/present`);
    return response.data;
  },

  // GET /api/attendance/exam/{examId}/absent
  getAbsentStudents: async (examId) => {
    const response = await axiosInstance.get(`/api/attendance/exam/${examId}/absent`);
    return response.data;
  },

  // DELETE /api/attendance/{attendanceId}
  deleteAttendance: async (attendanceId) => {
    const response = await axiosInstance.delete(`/api/attendance/${attendanceId}`);
    return response.data;
  },
};
