import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useLanguagesStore = defineStore('languages', () => {
  const languages = ref([]);
  const loading = ref(false);
  const selectedLanguageId = ref(null);

  const fetchLanguages = async () => {
    loading.value = true;
    try {
      const response = await api.get('/admin/languages');
      languages.value = response.data || [];
      // initialize selected language if not set
      if (!selectedLanguageId.value) {
        const saved = localStorage.getItem('nma.selectedLanguageId');
        if (saved) selectedLanguageId.value = Number(saved);
        else {
          const def = languages.value.find(l => l.isDefault) || languages.value[0];
          if (def) selectedLanguageId.value = def.id;
        }
      }
      return response.data || [];
    } catch (error) {
      console.error('Fetch languages failed:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const createLanguage = async (payload) => {
    try {
      const response = await api.post('/admin/languages', payload);
      languages.value = [...languages.value, response.data];
      return response.data;
    } catch (error) {
      console.error('Create language failed:', error);
      throw error;
    }
  };

  const updateLanguage = async (id, payload) => {
    try {
      const response = await api.put(`/admin/languages/${id}`, payload);
      languages.value = languages.value.map((language) =>
        language.id === id ? response.data : language
      );
      return response.data;
    } catch (error) {
      console.error('Update language failed:', error);
      throw error;
    }
  };

  const deleteLanguage = async (id) => {
    try {
      await api.delete(`/admin/languages/${id}`);
      languages.value = languages.value.filter((language) => language.id !== id);
      return true;
    } catch (error) {
      console.error('Delete language failed:', error);
      return false;
    }
  };

  const setSelectedLanguage = (id) => {
    selectedLanguageId.value = id;
    try { localStorage.setItem('nma.selectedLanguageId', String(id)); } catch (e) {}
  };

  return {
    languages,
    loading,
    fetchLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
  };
});
