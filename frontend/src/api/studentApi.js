import axiosInstance from './axiosConfig';

export const studentApi = {
  // GET /api/students
  getAllStudents: async () => {
    const response = await axiosInstance.get('/api/students');
    return response.data;
  },

  // GET /api/students/{id}
  getStudentById: async (id) => {
    const response = await axiosInstance.get(`/api/students/${id}`);
    return response.data;
  },

  // POST /api/students
  addStudent: async (studentDTO) => {
    const response = await axiosInstance.post('/api/students', studentDTO);
    return response.data;
  },

  // PUT /api/students/{id}
  updateStudent: async (id, studentDTO) => {
    const response = await axiosInstance.put(`/api/students/${id}`, studentDTO);
    return response.data;
  },

  // DELETE /api/students/{id}
  deleteStudent: async (id) => {
    const response = await axiosInstance.delete(`/api/students/${id}`);
    return response.data;
  },

  // GET /api/students/department/{departmentId}
  getStudentByDepartment: async (departmentId) => {
    const response = await axiosInstance.get(`/api/students/department/${departmentId}`);
    return response.data;
  },

  // GET /api/students/hallticket/{hallTicketNumber}
  getStudentByHallTicket: async (hallTicketNumber) => {
    const response = await axiosInstance.get(`/api/students/hallticket/${hallTicketNumber}`);
    return response.data;
  },

  // GET /api/students/page?page={page}&size={size}
  getStudentsByPage: async (page, size) => {
    const response = await axiosInstance.get(`/api/students/page?page=${page}&size=${size}`);
    return response.data;
  },

  // GET /api/students/sort?field={field}&direction={direction}
  getStudentsSorted: async (field, direction) => {
    const response = await axiosInstance.get(`/api/students/sort?field=${field}&direction=${direction}`);
    return response.data;
  },
};
