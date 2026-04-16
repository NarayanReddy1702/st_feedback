import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Student
export const getTeachers = () => API.get('/teacher/list');
export const submitFeedback = (data) => API.post('/feedback', data);
export const getMyFeedbacks = (page = 1) => API.get(`/feedback/my?page=${page}`);
export const updateFeedback = (id, data) => API.put(`/feedback/${id}`, data);
export const deleteFeedback = (id) => API.delete(`/feedback/${id}`);

// Teacher
export const getTeacherDashboard = (subject = '') =>
  API.get(`/teacher/dashboard${subject ? `?subject=${subject}` : ''}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = (role = '') => API.get(`/admin/users${role ? `?role=${role}` : ''}`);
export const toggleUserApproval = (id) => API.put(`/admin/users/${id}/toggle`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAllFeedback = () => API.get('/admin/feedbacks');
export const approveFeedback = (id, data) => API.put(`/admin/feedbacks/${id}/approve`, data);

export default API;
