<template>
  <div class="max-w-3xl space-y-8 animate-fade-in">
    <div>
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Site text &amp; configuration</h3>
      <p class="text-zinc-500 text-xs mt-2">
        Edit all copy shown on the landing page and presentation. Changes apply immediately after you save.
      </p>
    </div>

    <form @submit.prevent="saveAll" class="space-y-8">
      <section
        v-for="group in SETTING_GROUPS"
        :key="group.id"
        class="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <h4 class="text-sm font-bold text-[#0A0F0D]">{{ group.title }}</h4>
          <p v-if="group.hint" class="text-zinc-500 text-[10px] mt-1">{{ group.hint }}</p>
        </div>

        <div v-for="field in group.keys" :key="field.key" class="space-y-1">
          <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
            {{ field.label }}
            <span class="text-zinc-400 font-mono normal-case">({{ field.key }})</span>
          </label>
          <textarea
            v-if="field.type === 'textarea' || field.type === 'json'"
            v-model="form[field.key]"
            :rows="field.type === 'json' ? 6 : 4"
            :placeholder="field.type === 'json' ? 'JSON array or one option per line' : ''"
            class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-3 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none font-mono"
          />
          <MediaPicker
            v-else-if="field.type === 'image'"
            v-model="form[field.key]"
            assetType="image"
            :is-url-mode="true"
            :label="''"
            class="mt-1"
          />
          <input
            v-else
            v-model="form[field.key]"
            :type="field.type === 'url' ? 'url' : 'text'"
            class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-3 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none"
          />
        </div>
      </section>

      <section v-if="otherKeys.length" class="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-[#0A0F0D]">Other / custom settings</h4>
        <p class="text-zinc-500 text-[10px]">Keys created outside the groups above (or from the database).</p>
        <div v-for="key in otherKeys" :key="key" class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-semibold text-zinc-500 uppercase font-mono">{{ key }}</label>
            <button type="button" @click="removeCustom(key)" class="text-red-500 text-[10px]">Remove</button>
          </div>
          <textarea v-model="form[key]" rows="3" class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-3 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none" />
        </div>
      </section>

      <section class="bg-[#F4F6F5] border border-dashed border-zinc-300 rounded-xl p-6 space-y-3">
        <h4 class="text-sm font-bold text-zinc-500">Add custom setting</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input v-model="newKey" placeholder="setting_key" class="bg-white border border-zinc-200 rounded p-2 text-xs text-[#0A0F0D] font-mono focus:outline-none focus:border-[#008A20]" />
          <input v-model="newValue" placeholder="Value" class="sm:col-span-2 bg-white border border-zinc-200 rounded p-2 text-xs text-[#0A0F0D] focus:outline-none focus:border-[#008A20]" />
        </div>
        <button type="button" @click="addCustom" class="text-[#008A20] text-xs font-bold">+ Add to form</button>
      </section>

      <div v-if="message" class="text-xs font-bold text-[#008A20] bg-[#008A20]/5 border border-[#008A20]/20 p-3 rounded">
        ✓ {{ message }}
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="w-full bg-[#008A20] hover:bg-[#006616] text-white font-bold py-3 rounded-lg text-sm disabled:opacity-50 transition"
      >
        {{ saving ? 'Saving…' : 'Save all settings' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '../../stores/settings';
import { SETTING_GROUPS, JSON_SETTING_KEYS } from '../../config/settingMeta';
import MediaPicker from './MediaPicker.vue';

const settingsStore = useSettingsStore();
const form = ref({});
const saving = ref(false);
const message = ref('');
const newKey = ref('');
const newValue = ref('');

const knownKeys = computed(() => {
  const keys = new Set();
  SETTING_GROUPS.forEach(g => g.keys.forEach(k => keys.add(k.key)));
  return keys;
});

const otherKeys = computed(() =>
  Object.keys(form.value).filter(k => !knownKeys.value.has(k)).sort()
);

const jsonToEditable = (key, value) => {
  if (!JSON_SETTING_KEYS.has(key) || !value) return value || '';
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join('\n');
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
};

const editableToJson = (key, raw) => {
  if (!JSON_SETTING_KEYS.has(key)) return raw;
  const trimmed = (raw || '').trim();
  if (!trimmed) return '[]';
  if (trimmed.startsWith('[')) {
    JSON.parse(trimmed);
    return trimmed;
  }
  const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
  return JSON.stringify(lines);
};

const loadForm = () => {
  const next = {};
  Object.entries(settingsStore.settings).forEach(([key, value]) => {
    next[key] = jsonToEditable(key, value);
  });
  SETTING_GROUPS.forEach(g => {
    g.keys.forEach(f => {
      if (next[f.key] === undefined) next[f.key] = '';
    });
  });
  form.value = next;
};

onMounted(async () => {
  await settingsStore.fetchSettingsDetailed();
  loadForm();
});

const addCustom = () => {
  const key = newKey.value.trim().replace(/\s+/g, '_');
  if (!key) return;
  form.value[key] = newValue.value;
  newKey.value = '';
  newValue.value = '';
};

const removeCustom = async (key) => {
  if (!confirm(`Remove setting "${key}" from the database?`)) return;
  await settingsStore.adminDeleteSetting(key);
  delete form.value[key];
};

const saveAll = async () => {
  saving.value = true;
  message.value = '';
  const payload = {};
  for (const [key, raw] of Object.entries(form.value)) {
    try {
      payload[key] = JSON_SETTING_KEYS.has(key) ? editableToJson(key, raw) : raw;
    } catch {
      alert(`Invalid JSON for "${key}". Use one item per line or a valid JSON array.`);
      saving.value = false;
      return;
    }
  }
  const ok = await settingsStore.adminUpdateSettings(payload);
  if (ok) {
    message.value = 'All settings saved.';
    await settingsStore.fetchSettingsDetailed();
    loadForm();
  } else {
    alert('Save failed.');
  }
  saving.value = false;
};
</script>
