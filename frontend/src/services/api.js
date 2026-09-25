import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('falconAdminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
