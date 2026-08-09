import axiosInstance from './axiosConfig';

export const authApi = {
  // POST /api/users/login
  login: async (loginRequest) => {
    const response = await axiosInstance.post('/api/users/login', loginRequest);
    return response.data;
  },

  // POST /api/users/register
  register: async (userData) => {
    const response = await axiosInstance.post('/api/users/register', userData);
    return response.data;
  },

  // POST /api/users/forgot-password
  forgotPassword: async (forgotPasswordRequest) => {
    const response = await axiosInstance.post('/api/users/forgot-password', forgotPasswordRequest);
    return response.data;
  },

  // POST /api/users/verify-otp
  verifyOtp: async (verifyOtpRequest) => {
    const response = await axiosInstance.post('/api/users/verify-otp', verifyOtpRequest);
    return response.data;
  },

  // POST /api/users/reset-password
  resetPassword: async (resetPasswordRequest) => {
    const response = await axiosInstance.post('/api/users/reset-password', resetPasswordRequest);
    return response.data;
  },

  // PUT /api/users/change-password
  changePassword: async (changePasswordRequest) => {
    const response = await axiosInstance.put('/api/users/change-password', changePasswordRequest);
    return response.data;
  },
};
