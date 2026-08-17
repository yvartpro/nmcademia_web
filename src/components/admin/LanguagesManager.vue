<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Languages</h3>
        <p class="text-zinc-500 text-xs mt-1">Manage the site languages and set the default locale for translated content.</p>
      </div>
      <button
        type="button"
        @click="resetForm"
        class="bg-[#008A20] hover:bg-[#006616] text-white font-bold px-4 py-2.5 rounded-lg text-xs transition"
      >
        + Add language
      </button>
    </div>

    <div class="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section class="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
        <h4 class="text-xs font-bold uppercase tracking-wider text-[#0A0F0D] mb-4">
          {{ editingId ? 'Edit language' : 'Create language' }}
        </h4>

        <form @submit.prevent="saveLanguage" class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Code</label>
            <input v-model.trim="form.code" class="w-full border border-zinc-200 rounded-lg px-3 py-2.5 bg-[#F4F6F5] text-[#0A0F0D] focus:outline-none focus:border-[#008A20]" placeholder="en, fr, ar" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input v-model.trim="form.name" class="w-full border border-zinc-200 rounded-lg px-3 py-2.5 bg-[#F4F6F5] text-[#0A0F0D] focus:outline-none focus:border-[#008A20]" placeholder="English" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Native name</label>
            <input v-model.trim="form.nativeName" class="w-full border border-zinc-200 rounded-lg px-3 py-2.5 bg-[#F4F6F5] text-[#0A0F0D] focus:outline-none focus:border-[#008A20]" placeholder="English / Français" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-[#F4F6F5] px-3 py-2.5 cursor-pointer">
              <input v-model="form.isActive" type="checkbox" class="rounded accent-[#008A20]" />
              <span class="font-semibold text-zinc-600">Active</span>
            </label>

            <label class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-[#F4F6F5] px-3 py-2.5 cursor-pointer">
              <input v-model="form.isDefault" type="checkbox" class="rounded accent-[#008A20]" />
              <span class="font-semibold text-zinc-600">Default</span>
            </label>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Sort order</label>
            <input v-model.number="form.sortOrder" type="number" class="w-full border border-zinc-200 rounded-lg px-3 py-2.5 bg-[#F4F6F5] text-[#0A0F0D] focus:outline-none focus:border-[#008A20]" min="0" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" class="flex-1 bg-[#008A20] hover:bg-[#006616] text-white font-bold px-4 py-2.5 rounded-lg text-xs transition">
              {{ editingId ? 'Save changes' : 'Create language' }}
            </button>
            <button type="button" @click="resetForm" class="border border-zinc-200 bg-white text-zinc-600 hover:text-[#0A0F0D] px-4 py-2.5 rounded-lg text-xs font-semibold transition">
              Clear
            </button>
          </div>
        </form>
      </section>

      <section class="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div class="admin-scroll-table">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[#F4F6F5] text-[10px] uppercase tracking-wider text-[#0A0F0D] font-bold">
              <tr>
                <th class="p-4">Code</th>
                <th class="p-4">Name</th>
                <th class="p-4">Native</th>
                <th class="p-4">Status</th>
                <th class="p-4">Default</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 text-xs text-[#0A0F0D]">
              <tr v-for="language in languagesStore.languages" :key="language.id" class="hover:bg-[#F4F6F5]/60 transition">
                <td class="p-4">
                  <span class="inline-flex items-center rounded-full border border-[#008A20]/20 bg-[#008A20]/5 px-2 py-1 font-bold text-[#008A20] uppercase tracking-wide">
                    {{ language.code }}
                  </span>
                </td>
                <td class="p-4 font-semibold">{{ language.name }}</td>
                <td class="p-4 text-zinc-500">{{ language.nativeName || '—' }}</td>
                <td class="p-4">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-1 font-semibold',
                      language.isActive
                        ? 'bg-[#008A20]/10 text-[#008A20] border border-[#008A20]/20'
                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    ]"
                  >
                    {{ language.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-4">
                  <span
                    v-if="language.isDefault"
                    class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-semibold text-amber-700"
                  >
                    Default
                  </span>
                  <span v-else class="text-zinc-400">—</span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2 flex-wrap">
                    <button type="button" @click="setAsDefault(language)" class="border border-zinc-200 bg-white text-zinc-600 hover:border-[#008A20] hover:text-[#008A20] px-2 py-1 rounded transition text-[10px] font-semibold">
                      Default
                    </button>
                    <button type="button" @click="toggleActive(language)" class="border border-zinc-200 bg-white text-zinc-600 hover:border-[#008A20] hover:text-[#008A20] px-2 py-1 rounded transition text-[10px] font-semibold">
                      {{ language.isActive ? 'Disable' : 'Enable' }}
                    </button>
                    <button type="button" @click="editLanguage(language)" class="border border-zinc-200 bg-white text-zinc-600 hover:border-[#008A20] hover:text-[#008A20] px-2 py-1 rounded transition text-[10px] font-semibold">
                      Edit
                    </button>
                    <button type="button" @click="deleteLanguage(language)" class="border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded transition text-[10px] font-semibold">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="languagesStore.languages.length === 0">
                <td colspan="6" class="p-8 text-center text-zinc-400 text-xs">
                  No languages configured yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useLanguagesStore } from '../../stores/languages';

const languagesStore = useLanguagesStore();
const editingId = ref(null);

const defaultForm = () => ({
  code: '',
  name: '',
  nativeName: '',
  isDefault: false,
  isActive: true,
  sortOrder: 0
});

const form = ref(defaultForm());

const resetForm = () => {
  editingId.value = null;
  form.value = defaultForm();
};

const editLanguage = (language) => {
  editingId.value = language.id;
  form.value = {
    code: language.code || '',
    name: language.name || '',
    nativeName: language.nativeName || '',
    isDefault: !!language.isDefault,
    isActive: language.isActive !== false,
    sortOrder: language.sortOrder || 0
  };
};

const saveLanguage = async () => {
  if (!form.value.code || !form.value.name) return;

  const payload = {
    ...form.value,
    code: form.value.code.trim(),
    name: form.value.name.trim(),
    nativeName: form.value.nativeName ? form.value.nativeName.trim() : null,
    isDefault: !!form.value.isDefault,
    isActive: form.value.isActive !== false
  };

  try {
    if (editingId.value) {
      await languagesStore.updateLanguage(editingId.value, payload);
    } else {
      await languagesStore.createLanguage(payload);
    }

    resetForm();
    await languagesStore.fetchLanguages();
  } catch (error) {
    console.error('Save language failed:', error);
    alert(error?.response?.data?.message || 'Unable to save language.');
  }
};

const setAsDefault = async (language) => {
  try {
    await languagesStore.updateLanguage(language.id, {
      ...language,
      isDefault: true,
      isActive: language.isActive !== false
    });
    await languagesStore.fetchLanguages();
  } catch (error) {
    console.error('Set default failed:', error);
    alert(error?.response?.data?.message || 'Unable to set default language.');
  }
};

const toggleActive = async (language) => {
  try {
    await languagesStore.updateLanguage(language.id, {
      ...language,
      isActive: !language.isActive,
      isDefault: !!language.isDefault
    });
    await languagesStore.fetchLanguages();
  } catch (error) {
    console.error('Toggle language failed:', error);
    alert(error?.response?.data?.message || 'Unable to update language status.');
  }
};

const deleteLanguage = async (language) => {
  if (!confirm(`Delete the "${language.name}" language?`)) return;

  const ok = await languagesStore.deleteLanguage(language.id);
  if (!ok) {
    alert('Unable to delete language.');
  }
};

onMounted(() => {
  languagesStore.fetchLanguages();
});
</script>
