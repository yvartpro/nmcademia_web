import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || null);
  const user = ref(JSON.parse(localStorage.getItem('admin_user')) || null);
  const loading = ref(false);
  const error = ref(null);

  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/login', { username, password });
      token.value = response.data.token;
      user.value = { username };

      localStorage.setItem('admin_token', token.value);
      localStorage.setItem('admin_user', JSON.stringify(user.value));

      // Setup default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete api.defaults.headers.common['Authorization'];
  };

  // Restore token on init
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return {
    token,
    user,
    loading,
    error,
    login,
    logout
  };
});
