import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

const getScopeKey = (ownerIdOverride = null) => {
  const ownerId = ownerIdOverride || localStorage.getItem('nma.currentOwnerId') || sessionStorage.getItem('nma.currentOwnerId');
  const host = typeof window !== 'undefined' ? window.location.hostname : 'default';
  return ownerId ? `nma.selectedLanguageId.owner.${ownerId}` : `nma.selectedLanguageId.host.${host}`;
};

export const useLanguagesStore = defineStore('languages', () => {
  const languages = ref([]);
  const loading = ref(false);
  const selectedLanguageId = ref(null);

  const fetchLanguages = async () => {
    loading.value = true;
    try {
      const response = await api.get('/languages');
      languages.value = response.data || [];

      // initialize selected language for the current owner/domain, not globally
      if (!selectedLanguageId.value) {
        const scopeKey = getScopeKey();
        const saved = localStorage.getItem(scopeKey) ?? localStorage.getItem('nma.selectedLanguageId');
        if (saved) selectedLanguageId.value = Number(saved);
        else {
          const def = languages.value.find(l => l.isDefault) || languages.value[0];
          if (def) selectedLanguageId.value = def.id;
        }
        if (selectedLanguageId.value) {
          localStorage.setItem(scopeKey, String(selectedLanguageId.value));
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

  const setSelectedLanguage = (id, ownerIdOverride = null) => {
    selectedLanguageId.value = id;
    try {
      localStorage.setItem(getScopeKey(ownerIdOverride), String(id));
    } catch (e) {}
  };

  return {
    languages,
    loading,
    fetchLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    selectedLanguageId,
    setSelectedLanguage
  };
});
 
