import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({});
  const loading = ref(false);

  const fetchSettings = async () => {
    loading.value = true;
    try {
      const response = await api.get('/settings');
      settings.value = response.data;
    } catch (err) {
      console.error('Fetch settings failed:', err);
    } finally {
      loading.value = false;
    }
  };

  const adminUpdateSettings = async (settingsPayload) => {
    loading.value = true;
    try {
      const response = await api.put('/admin/settings', settingsPayload);
      settings.value = response.data.settings;
      return true;
    } catch (err) {
      console.error('Admin update settings failed:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    settings,
    loading,
    fetchSettings,
    adminUpdateSettings
  };
});
