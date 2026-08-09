import axiosInstance from './axiosConfig';

export const studentSubjectApi = {
  // GET /api/student-subjects
  getAllStudentSubjects: async () => {
    const response = await axiosInstance.get('/api/student-subjects');
    return response.data;
  },

  // GET /api/student-subjects/student/{studentId}
  getSubjectsByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/api/student-subjects/student/${studentId}`);
    return response.data;
  },

  // GET /api/student-subjects/subject/{subjectId}
  getStudentsBySubject: async (subjectId) => {
    const response = await axiosInstance.get(`/api/student-subjects/subject/${subjectId}`);
    return response.data;
  },

  // POST /api/student-subjects
  registerStudentSubject: async (requestDto) => {
    const response = await axiosInstance.post('/api/student-subjects', requestDto);
    return response.data;
  },

  // DELETE /api/student-subjects/{id}
  unregisterStudentSubject: async (id) => {
    const response = await axiosInstance.delete(`/api/student-subjects/${id}`);
    return response.data;
  },
};
