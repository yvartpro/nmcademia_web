import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLanguagesStore } from './languages';

const getByPath = (obj, path, defaultValue = '') => {
  if (!obj || !path) return defaultValue;
  return path.split('.').reduce((acc, part) => (acc && (acc[part] !== undefined) ? acc[part] : undefined), obj) ?? defaultValue;
};

export const useTranslationsStore = defineStore('translations', () => {
  const messages = ref({});
  const loading = ref(false);
  const current = ref(null); // language code
  const source = ref('json'); // 'json' | 'api' | 'auto'

  // attempt to load translations from API endpoint
  const loadFromApi = async (code) => {
    try {
      const res = await fetch(`/api/translations?lang=${encodeURIComponent(code)}`, { cache: 'no-cache' });
      if (!res.ok) throw new Error('API translations not available');
      const data = await res.json();
      // Expecting nested object or flat map; prefer nested
      return data;
    } catch (err) {
      // bubble up to allow fallback
      throw err;
    }
  };

  const loadFromJson = async (code) => {
    const res = await fetch(`/locales/${code}.json`, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error('JSON locale not found');
    }
    const data = await res.json();
    return data;
  };

  // load by language code using configured source with fallback
  const loadByCode = async (code) => {
    if (!code) return;
    if (current.value === code) return;
    loading.value = true;
    try {
      let data = {};
      if (source.value === 'api') {
        data = await loadFromApi(code);
      } else if (source.value === 'json') {
        data = await loadFromJson(code);
      } else { // auto: try api then json
        try {
          data = await loadFromApi(code);
        } catch (err) {
          data = await loadFromJson(code);
        }
      }
      messages.value = data || {};
      current.value = code;
    } catch (err) {
      console.warn('Loading translations failed, clearing messages', err);
      messages.value = {};
      current.value = code;
    } finally {
      loading.value = false;
    }
  };

  const loadById = async (id) => {
    const languagesStore = useLanguagesStore();
    // ensure languages loaded
    if (!languagesStore.languages.length) await languagesStore.fetchLanguages();
    const lang = languagesStore.languages.find((l) => l.id === Number(id));
    if (lang && lang.code) await loadByCode(lang.code);
  };

  const setSource = (s) => {
    if (['json', 'api', 'auto'].includes(s)) source.value = s;
  };

  const initForSelected = async (selectedId) => {
    await loadById(selectedId);
  };

  const t = (key, defaultValue = '') => {
    return getByPath(messages.value, key, defaultValue) || defaultValue || key;
  };

  return {
    messages,
    loading,
    current,
    source,
    setSource,
    loadByCode,
    loadById,
    initForSelected,
    t,
  };
});
