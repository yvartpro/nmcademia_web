import axios from 'axios';

const getBackendOrigin = () => {
  const envOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
  if (envOrigin) return envOrigin.replace(/\/$/, '');
  return window.location.origin;
};

const getBaseUrl = () => {
  return '/api';
};

export const getMediaUrl = (filePath) => {
  if (!filePath) return '';
  return filePath.startsWith('/') ? filePath : `/${filePath}`;
};

export const getFullMediaUrl = (filePath) => {
  if (!filePath) return '';
  const origin = getBackendOrigin();
  const path = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${origin}${path}`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to inject jwt token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch 401s and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - clearing token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
