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
  const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_ORIGIN;

  if (envBase) {
    const normalized = envBase.replace(/\/$/, '');
    return normalized.includes('/api') ? normalized : `${normalized}/api`;
  }

  return '/api';
};

/** Collapse duplicate slashes and repair compound/broken URLs without forcing HTTPS on HTTP. */
export const normalizeMediaPath = (path) => {
  if (!path) return '';

  // Handle comma-separated URLs returned from backend fields
  if (path.includes(',')) {
    const parts = path.split(',');
    path = parts[parts.length - 1].trim();
  }

  // FIX: Detect if the incoming path intended to use http or https
  const isHttp = /^http[s]?/i.test(path);
  const isExplicitHttps = /^https/i.test(path);
  const correctProtocol = isHttp ? (isExplicitHttps ? 'https://' : 'http://') : '';

  // Repair broken compound protocols (e.g., "https, https:/") using the detected correct protocol
  if (correctProtocol) {
    path = path.replace(/^https?,\s*https?:\/+/i, correctProtocol);
    path = path.replace(/^https?:\/+(?!\/)/i, correctProtocol);
  }

  if (/^(https?:\/\/)/i.test(path)) {
    const fixed = path.replace(/^(https?:)\/+/, '$1//');
    let normalized = fixed.replace(/([^:]\/)\/+/, '$1');
    
    // Robustly strip nested domains out of the path string
    normalized = normalized.replace(/(https?:\/\/[^/]+)\/(?:https?:\/\/[^/]+)(\/.*)$/i, '$1$2');
    normalized = normalized.replace(/(https?:\/\/[^/]+)\/(?:https?:\/[^/]+)(\/.*)$/i, '$1$2');
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

  // Clean the incoming value before analyzing it (now keeps http as http)
  value = normalizeMediaPath(value);

  const origin = getBackendOrigin().replace(/\/+$/, '');
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const remoteHostPattern = /^https?:\/+(?:www\.)?nmacademia\.com/i;

  if (isLocalHost && remoteHostPattern.test(value)) {
    let path = value.replace(remoteHostPattern, '');
    path = path.replace(/^\/https?:\/+(?:www\.)?nmacademia\.com/i, '');
    return `${origin}${normalizeMediaPath(path)}`;
  }

  // Matches both http://localhost:5000 AND https://localhost:5000 (or any localhost port)
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;
  if (localhostPattern.test(value)) {
    const path = value.replace(localhostPattern, '');
    return normalizeMediaPath(`${origin}${path}`);
  }

  if (/^(https?:\/\/)/i.test(value)) {
    return value; 
  }
  
  return `${origin}${value}`;
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
