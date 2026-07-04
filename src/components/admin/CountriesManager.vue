<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Countries &amp; regions</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add country
      </button>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4">Flag</th>
            <th class="p-4">Code</th>
            <th class="p-4">Name</th>
            <th class="p-4">Currency</th>
            <th class="p-4">WhatsApp</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="c in catalogStore.countries" :key="c.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4">
              <CountryFlag :flag-icon="c.flagIcon" :code="c.code" :name="c.name" size="md" />
            </td>
            <td class="p-4 font-mono text-[#008A20] font-bold">{{ c.code }}</td>
            <td class="p-4 text-[#0A0F0D] font-bold">{{ c.name }}</td>
            <td class="p-4">{{ c.currencySymbol }} ({{ c.currency }})</td>
            <td class="p-4 truncate max-w-[140px]">{{ c.whatsappNumber || '—' }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(c)" class="text-[#008A20] hover:text-[#006616] font-semibold transition">Edit</button>
              <button @click="requestDelete(c.id)" class="text-red-500 hover:text-red-700 font-semibold transition">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Country' : 'New Country'" subtitle="Markets &amp; Pricing Regions">
      <form id="country-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="adm-field">
          <label class="adm-label">Country name</label>
          <input v-model="form.name" required class="adm-input" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="adm-field">
            <label class="adm-label">Code (e.g. NG)</label>
            <input v-model="form.code" required maxlength="10" class="adm-input uppercase" @input="syncFlagFromCode" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Currency code</label>
            <input v-model="form.currency" required class="adm-input" />
          </div>
        </div>
        <div class="adm-field">
          <label class="adm-label">Flag icon (flag-icons)</label>
          <div class="flex items-center gap-3">
            <input
              v-model="form.flagIcon"
              :placeholder="FLAG_ICON_EXAMPLE"
              class="adm-input flex-1 font-mono"
              @input="flagTouched = true"
            />
            <CountryFlag :flag-icon="form.flagIcon" :code="form.code" size="lg" />
          </div>
          <p class="text-[10px] text-zinc-500 mt-1">
            Use <code class="font-mono">fi fi-ng</code>, <code class="font-mono">fi-ng</code>, or <code class="font-mono">ng</code>. Auto-filled from country code if empty.
          </p>
        </div>
        <div class="adm-field">
          <label class="adm-label">Currency symbol</label>
          <input v-model="form.currencySymbol" required class="adm-input" />
        </div>
        <div class="adm-field">
          <label class="adm-label">Trainer WhatsApp</label>
          <input v-model="form.whatsappNumber" placeholder="+234…" class="adm-input" />
        </div>
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="country-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create Country' }}
        </button>
      </template>
    </UiModal>

    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this country?"
      message="Package prices configured for this country will also be removed. This cannot be undone."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCatalogStore } from '../../stores/catalog';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';
import CountryFlag from '../ui/CountryFlag.vue';
import { defaultFlagIcon, FLAG_ICON_EXAMPLE, normalizeFlagIcon } from '../../utils/countryFlag';

const catalogStore = useCatalogStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({
  name: '',
  code: '',
  currency: '',
  currencySymbol: '',
  whatsappNumber: '',
  flagIcon: '',
});
const confirmOpen = ref(false);
const pendingDeleteId = ref(null);
const flagTouched = ref(false);

onMounted(() => catalogStore.adminFetchCountries());

const syncFlagFromCode = () => {
  if (!flagTouched.value || !form.value.flagIcon) {
    form.value.flagIcon = defaultFlagIcon(form.value.code);
  }
};

const openModal = (item = null) => {
  flagTouched.value = false;
  if (item) {
    editingId.value = item.id;
    form.value = {
      name: item.name,
      code: item.code,
      currency: item.currency,
      currencySymbol: item.currencySymbol,
      whatsappNumber: item.whatsappNumber || '',
      flagIcon: item.flagIcon || defaultFlagIcon(item.code),
    };
    flagTouched.value = true;
  } else {
    editingId.value = null;
    form.value = {
      name: '',
      code: '',
      currency: '',
      currencySymbol: '',
      whatsappNumber: '',
      flagIcon: '',
    };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  const code = form.value.code.toUpperCase();
  const payload = {
    ...form.value,
    code,
    flagIcon: normalizeFlagIcon(form.value.flagIcon?.trim(), code) || defaultFlagIcon(code),
  };
  if (editingId.value) await catalogStore.adminUpdateCountry(editingId.value, payload);
  else await catalogStore.adminCreateCountry(payload);
  isModalOpen.value = false;
};

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await catalogStore.adminDeleteCountry(pendingDeleteId.value);
  pendingDeleteId.value = null;
};
</script>

<style scoped>
.adm-field { display: flex; flex-direction: column; gap: 0.25rem; }
.adm-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; }
.adm-input { width: 100%; background: #F4F6F5; border: 1px solid #e4e4e7; border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #0A0F0D; font-size: 0.75rem; outline: none; transition: border-color 0.15s; }
.adm-input:focus { border-color: #008A20; }
.adm-btn-ghost { font-size: 0.75rem; font-weight: 700; color: #6b7280; background: transparent; border: 1px solid #e4e4e7; cursor: pointer; padding: 0.5rem 0.875rem; border-radius: 0.5rem; transition: color 0.15s, border-color 0.15s; }
.adm-btn-ghost:hover { color: #0A0F0D; border-color: #a1a1aa; }
.adm-btn-primary { font-size: 0.75rem; font-weight: 800; background: #008A20; color: #fff; padding: 0.55rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: filter 0.15s; }
.adm-btn-primary:hover { filter: brightness(1.1); }
</style>
