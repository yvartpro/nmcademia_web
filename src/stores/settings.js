import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';
import { useLanguagesStore } from './languages';

const getLanguageParams = () => {
  const languagesStore = useLanguagesStore();
  const selectedId = Number(localStorage.getItem('nma.selectedLanguageId') ?? languagesStore.selectedLanguageId ?? 0);
  const language = languagesStore.languages.find((item) => item.id === selectedId)
    || languagesStore.languages.find((item) => item.isDefault)
    || languagesStore.languages[0];

  return language && language.code ? { params: { lang: language.code } } : {};
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({});
  const settingsDetailed = ref([]);
  const loading = ref(false);

  const fetchSettings = async () => {
    loading.value = true;
    try {
      const response = await api.get('/settings', getLanguageParams());
      settings.value = response.data;
    } catch (err) {
      console.error('Fetch settings failed:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchSettingsDetailed = async () => {
    loading.value = true;
    try {
      const response = await api.get('/admin/settings');
      settingsDetailed.value = response.data;
      const configMap = {};
      response.data.forEach((s) => {
        configMap[s.key] = s.value;
      });
      settings.value = configMap;
    } catch (err) {
      console.error('Fetch detailed settings failed:', err);
    } finally {
      loading.value = false;
    }
  };

  const adminDeleteSetting = async (key) => {
    try {
      await api.delete(`/admin/settings/${encodeURIComponent(key)}`);
      settingsDetailed.value = settingsDetailed.value.filter((s) => s.key !== key);
      const next = { ...settings.value };
      delete next[key];
      settings.value = next;
      return true;
    } catch (err) {
      console.error('Admin delete setting failed:', err);
      return false;
    }
  };

  const adminUpdateSettings = async (settingsPayload) => {
    loading.value = true;
    try {
      const response = await api.put('/admin/settings', settingsPayload);
      settings.value = response.data.settings;
      console.log('Admin update settings successful:', response.data);
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
    settingsDetailed,
    loading,
    fetchSettings,
    fetchSettingsDetailed,
    adminUpdateSettings,
    adminDeleteSetting
  };
});
