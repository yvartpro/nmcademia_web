<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Countries & regions</h3>
      <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add country
      </button>
    </div>

    <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
          <tr>
            <th class="p-4">Code</th>
            <th class="p-4">Name</th>
            <th class="p-4">Currency</th>
            <th class="p-4">WhatsApp</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-950 text-gray-300">
          <tr v-for="c in catalogStore.countries" :key="c.id" class="hover:bg-slate-900/30">
            <td class="p-4 font-mono text-amber-500 font-bold">{{ c.code }}</td>
            <td class="p-4 text-white font-bold">{{ c.name }}</td>
            <td class="p-4">{{ c.currencySymbol }} ({{ c.currency }})</td>
            <td class="p-4 truncate max-w-[140px]">{{ c.whatsappNumber || '—' }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(c)" class="text-amber-400">Edit</button>
              <button @click="handleDelete(c.id)" class="text-red-400">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2 mb-4">{{ editingId ? 'Edit' : 'New' }} country</h4>
        <form @submit.prevent="saveItem" class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-400 font-bold mb-1">Country name</label>
            <input v-model="form.name" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-400 font-bold mb-1">Code (e.g. NG)</label>
              <input v-model="form.code" required maxlength="10" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white uppercase" />
            </div>
            <div>
              <label class="block text-gray-400 font-bold mb-1">Currency code</label>
              <input v-model="form.currency" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
            </div>
          </div>
          <div>
            <label class="block text-gray-400 font-bold mb-1">Currency symbol</label>
            <input v-model="form.currencySymbol" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
          </div>
          <div>
            <label class="block text-gray-400 font-bold mb-1">Trainer WhatsApp</label>
            <input v-model="form.whatsappNumber" placeholder="+234…" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-900">
            <button type="button" @click="isModalOpen = false" class="text-gray-400">Cancel</button>
            <button type="submit" class="bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCatalogStore } from '../../stores/catalog';

const catalogStore = useCatalogStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ name: '', code: '', currency: '', currencySymbol: '', whatsappNumber: '' });

onMounted(() => catalogStore.adminFetchCountries());

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = { name: item.name, code: item.code, currency: item.currency, currencySymbol: item.currencySymbol, whatsappNumber: item.whatsappNumber || '' };
  } else {
    editingId.value = null;
    form.value = { name: '', code: '', currency: '', currencySymbol: '', whatsappNumber: '' };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  const payload = { ...form.value, code: form.value.code.toUpperCase() };
  if (editingId.value) await catalogStore.adminUpdateCountry(editingId.value, payload);
  else await catalogStore.adminCreateCountry(payload);
  isModalOpen.value = false;
};

const handleDelete = async (id) => {
  if (confirm('Delete this country? Package prices for it will be removed.')) {
    await catalogStore.adminDeleteCountry(id);
  }
};
</script>
