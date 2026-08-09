import axiosInstance from './axiosConfig';

export const departmentApi = {
  // GET /api/departments
  getAllDepartments: async () => {
    const response = await axiosInstance.get('/api/departments');
    return response.data;
  },

  // GET /api/departments/{id}
  getDepartmentById: async (id) => {
    const response = await axiosInstance.get(`/api/departments/${id}`);
    return response.data;
  },

  // POST /api/departments
  addDepartment: async (departmentDTO) => {
    const response = await axiosInstance.post('/api/departments', departmentDTO);
    return response.data;
  },

  // PUT /api/departments/{id}
  updateDepartmentById: async (id, departmentDTO) => {
    const response = await axiosInstance.put(`/api/departments/${id}`, departmentDTO);
    return response.data;
  },

  // DELETE /api/departments/{id}
  deleteDepartmentById: async (id) => {
    const response = await axiosInstance.delete(`/api/departments/${id}`);
    return response.data;
  },
};
