<template>
  <div class="space-y-3">
    <div class="flex items-center gap-3">
      <select v-model="selectedLanguageId" class="border border-zinc-200 rounded px-3 py-2 text-xs bg-white">
        <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.name }} ({{ lang.code }})</option>
      </select>
      <button @click="loadTranslations" class="text-xs bg-[#008A20] text-white px-3 py-2 rounded">Load</button>
      <button @click="copyFromDefault" class="text-xs border border-zinc-200 px-3 py-2 rounded">Copy from default</button>
    </div>

    <div v-if="loading" class="text-xs text-zinc-500">Loading translations…</div>

    <div v-if="!loading && fields.length === 0" class="text-xs text-zinc-400">No translatable fields configured.</div>

    <div v-for="f in fields" :key="f" class="space-y-1">
      <label class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">{{ f }}</label>
      <textarea v-model="values[f]" rows="3" class="w-full border border-zinc-200 rounded px-3 py-2 text-sm"></textarea>
    </div>

    <div class="flex gap-2 justify-end">
      <button @click="saveTranslations" class="text-xs bg-[#008A20] text-white px-3 py-2 rounded">Save translations</button>
      <button @click="$emit('cancel')" class="text-xs border border-zinc-200 px-3 py-2 rounded">Close</button>
    </div>
  </div>

  <DismissibleModal v-model:modelValue="showNotice" :title="noticeTitle" :subtitle="noticeSubtitle">
    <p class="text-sm text-zinc-700">{{ noticeMessage }}</p>
  </DismissibleModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api';
import DismissibleModal from '../ui/DismissibleModal.vue';

const props = defineProps({
  modelName: { type: String, required: true },
  recordId: { type: [String, Number], required: true },
  fields: { type: Array, default: () => [] }
});

const languages = ref([]);
const selectedLanguageId = ref(null);
const loading = ref(false);
const values = ref({});
const showNotice = ref(false);
const noticeTitle = ref('Notice');
const noticeSubtitle = ref('');
const noticeMessage = ref('');

const showNotification = (title, message, subtitle = '') => {
  noticeTitle.value = title;
  noticeSubtitle.value = subtitle;
  noticeMessage.value = message;
  showNotice.value = true;
};

const loadLanguages = async () => {
  try {
    const res = await api.get('/admin/languages');
    languages.value = res.data || [];
    if (languages.value.length) selectedLanguageId.value = languages.value[0].id;
  } catch (err) {
    console.error('Load languages failed', err);
  }
};

const loadTranslations = async () => {
  if (!selectedLanguageId.value) return;
  loading.value = true;
  try {
    const res = await api.get('/admin/translations', {
      params: { modelName: props.modelName, recordId: String(props.recordId), languageId: selectedLanguageId.value }
    });
    const list = res.data || [];
    props.fields.forEach(f => {
      const match = list.find(l => l.field === f);
      values.value[f] = match ? match.value : '';
    });
  } catch (err) {
    console.error('Load translations error', err);
  } finally {
    loading.value = false;
  }
};

const saveTranslations = async () => {
  if (!selectedLanguageId.value) return;
  const payload = {
    modelName: props.modelName,
    recordId: String(props.recordId),
    languageId: selectedLanguageId.value,
    translations: Object.entries(values.value).map(([field, value]) => ({ field, value }))
  };

  try {
    await api.post('/admin/translations/bulk', payload);
    showNotification('Translations saved', 'The language values were saved successfully.');
  } catch (err) {
    console.error('Save translations failed', err);
    showNotification('Save failed', err?.response?.data?.message || 'Unable to save the translations.');
  }
};

const copyFromDefault = async () => {
  // Fetch default translations (language marked isDefault) and copy values
  try {
    const langs = await api.get('/admin/languages');
    const defaultLang = (langs.data || []).find(l => l.isDefault);
    if (!defaultLang) {
      showNotification('Default language required', 'No default language is configured for this owner.');
      return;
    }

    const res = await api.get('/admin/translations', { params: { modelName: props.modelName, recordId: String(props.recordId), languageId: defaultLang.id } });
    const list = res.data || [];
    props.fields.forEach(f => {
      const match = list.find(l => l.field === f);
      values.value[f] = match ? match.value : '';
    });
  } catch (err) {
    console.error('Copy default failed', err);
    showNotification('Copy failed', err?.response?.data?.message || 'Unable to copy the default-language values.');
  }
};

onMounted(() => {
  loadLanguages();
  props.fields.forEach(f => values.value[f] = '');
});
</script>
