import axios from 'axios';

const getBackendOrigin = () => {
  const envOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
  const localHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (localHost) {
    return window.location.origin;
  }

  if (envOrigin) return envOrigin.replace(/\/$/, '');
  return window.location.origin;
};

const getBaseUrl = () => {
  return '/api';
};

/** Collapse duplicate slashes in a path (not after `://`). */
export const normalizeMediaPath = (path) => {
  if (!path) return '';
  if (/^(https?:\/\/|https?:\/[^/])/i.test(path)) {
    const fixed = path.replace(/^(https?:)\/+/, '$1//');
    let normalized = fixed.replace(/([^:]\/)\/+/, '$1');
    normalized = normalized.replace(/^(https?:\/\/[^/]+)\/(?:https?:\/\/[^/]+)(\/.*)$/i, '$1$2');
    normalized = normalized.replace(/^(https?:\/\/[^/]+)\/(?:https?:\/[^/]+)(\/.*)$/i, '$1$2');
    return normalized;
  }
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return withLeading.replace(/\/+/g, '/');
};

export const getMediaUrl = (filePath) => normalizeMediaPath(filePath);

export const getFullMediaUrl = (filePathOrAsset) => {
  if (!filePathOrAsset) return '';
  
  let value = '';
  if (typeof filePathOrAsset === 'object') {
    value = filePathOrAsset.publicUrl || filePathOrAsset.filePath || '';
  } else {
    value = filePathOrAsset;
  }
  
  if (!value) return '';

  const origin = getBackendOrigin().replace(/\/+$/, '');
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const remoteHostPattern = /^https?:\/+(?:www\.)?nmacademia\.com/i;

  if (isLocalHost && remoteHostPattern.test(value)) {
    let path = value.replace(remoteHostPattern, '');
    path = path.replace(/^\/https?:\/+(?:www\.)?nmacademia\.com/i, '');
    return `${origin}${normalizeMediaPath(path)}`;
  }

  // Normalize localhost:5000 urls to use current backend origin
  if (value.startsWith('http://localhost:5000') || value.startsWith('https://localhost:5000')) {
    const path = value.replace(/^https?:\/\/localhost:5000/, '');
    return normalizeMediaPath(`${origin}${path}`);
  }
  if (/^(https?:\/\/|https?:\/[^/])/i.test(value)) {
    return normalizeMediaPath(value);
  }
  
  const path = normalizeMediaPath(value);
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
