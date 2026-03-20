import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);
const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || '').replace(/\/$/, '');
const DEV_API_TARGET = (import.meta.env.VITE_DEV_API_TARGET || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(error);
  }
);

// Stats API
export const getStats = () => api.get('/stats');
export const updateStats = (data) => api.put('/stats', data);

// Events API
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Stories API
export const getStories = () => api.get('/stories');
export const getStory = (id) => api.get(`/stories/${id}`);

export const createStory = (data) => {
  // Check if data is FormData (file upload)
  if (data instanceof FormData) {
    return api.post('/stories', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  return api.post('/stories', data);
};

export const updateStory = (id, data) => {
  // Check if data is FormData (file upload)
  if (data instanceof FormData) {
    return api.put(`/stories/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  return api.put(`/stories/${id}`, data);
};

export const deleteStory = (id) => api.delete(`/stories/${id}`);

// Admin Auth API
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const verifyToken = () => api.get('/admin/verify');

export const resolveMediaUrl = (mediaPath) => {
  if (!mediaPath || typeof mediaPath !== 'string') {
    return '';
  }

  if (/^https?:\/\//i.test(mediaPath)) {
    return mediaPath;
  }

  const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  const resolvedOrigin = API_ORIGIN || (import.meta.env.DEV ? DEV_API_TARGET : '');

  return `${resolvedOrigin}${normalizedPath}`;
};

export default api;
