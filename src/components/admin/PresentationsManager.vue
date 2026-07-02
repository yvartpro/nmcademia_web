<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Product Presentations</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add presentation
      </button>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4">Title</th>
            <th class="p-4">Media</th>
            <th class="p-4">Countries</th>
            <th class="p-4">Order</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="p in presentations" :key="p.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4 font-semibold text-[#0A0F0D]">{{ p.title }}</td>
            <td class="p-4 text-xs">
              <span v-if="p.media" class="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100">
                {{ p.media.type }}
              </span>
            </td>
            <td class="p-4">
              <div v-if="p.countries && p.countries.length > 0" class="flex flex-wrap gap-1">
                <span v-for="c in p.countries" :key="c.id" class="inline-block px-2 py-0.5 bg-accent/20 text-accent font-semibold text-[9px] rounded">
                  {{ c.code }}
                </span>
              </div>
              <span v-else class="text-zinc-400 text-[9px]">—</span>
            </td>
            <td class="p-4 font-mono text-zinc-400">{{ p.order }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(p)" class="text-[#008A20] hover:text-[#006616] font-semibold transition">Edit</button>
              <button @click="requestDelete(p.id)" class="text-red-500 hover:text-red-700 font-semibold transition">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="presentations.length === 0" class="p-8 text-center text-zinc-400 text-sm">
        No presentations created yet.
      </div>
    </div>

    <!-- Form Modal -->
    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Presentation' : 'New Presentation'" subtitle="Select video and associate countries">
      <form id="presentation-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="adm-field">
          <label class="adm-label">Presentation title</label>
          <input v-model="form.title" required class="adm-input" placeholder="e.g. Product Overview" />
        </div>

        <div class="adm-field">
          <label class="adm-label">Description (optional)</label>
          <textarea v-model="form.description" rows="3" class="adm-input" placeholder="Brief overview of what viewers will learn..."></textarea>
        </div>

        <div class="adm-field">
          <label class="adm-label">Select video</label>
          <MediaPicker v-model="form.mediaId" assetType="video" label="Video" />
        </div>

        <div class="adm-field">
          <label class="adm-label">Associate with countries</label>
          <div class="border border-zinc-200 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-zinc-50">
            <label v-for="c in catalogStore.countries" :key="c.id" class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                :value="c.id" 
                v-model="form.countryIds"
                class="w-4 h-4 rounded border-zinc-300"
              />
              <span class="text-zinc-700 font-semibold">{{ c.name }} ({{ c.code }})</span>
            </label>
          </div>
          <p v-if="form.countryIds.length === 0" class="text-[9px] text-amber-600 mt-1">At least one country should be selected</p>
        </div>

        <div class="adm-field">
          <label class="adm-label">Display order</label>
          <input v-model.number="form.order" type="number" class="adm-input" />
        </div>

        <div class="adm-field flex items-center gap-2">
          <input v-model="form.active" type="checkbox" class="w-4 h-4 rounded border-zinc-300" />
          <label class="adm-label mb-0">Active (show in presentation)</label>
        </div>
      </form>

      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="presentation-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create Presentation' }}
        </button>
      </template>
    </UiModal>

    

    <!-- Confirm Delete -->
    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this presentation?"
      message="This cannot be undone."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';
import { useCatalogStore } from '../../stores/catalog';
import { useMediaStore } from '../../stores/media';
import MediaPicker from './MediaPicker.vue';

const catalogStore = useCatalogStore();
const mediaStore = useMediaStore();

const presentations = ref([]);
const isModalOpen = ref(false);
const confirmOpen = ref(false);
const editingId = ref(null);

const form = ref({
  title: '',
  description: '',
  mediaId: null,
  countryIds: [],
  order: 0,
  active: true
});

const selectedMedia = computed(() => {
  if (!form.value.mediaId) return null;
  return mediaStore.assets.find(a => a.id === form.value.mediaId);
});

const loadPresentations = async () => {
  try {
    const res = await api.get('/admin/presentations');
    const payload = res?.data;

    if (Array.isArray(payload)) {
      presentations.value = payload;
    } else if (payload && typeof payload === 'object' && Array.isArray(payload.presentations)) {
      presentations.value = payload.presentations;
    } else {
      presentations.value = [];
    }

    console.log('Loaded presentations:', presentations.value);
  } catch (err) {
    presentations.value = [];
    console.error('Error fetching presentations:', err);

    if (err?.response?.data && typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE')) {
      console.error('The admin API responded with HTML instead of JSON. Check the configured backend URL and auth setup.');
    }
  }
};

const openModal = (presentation = null) => {
  if (presentation) {
    editingId.value = presentation.id;
    form.value = {
      title: presentation.title,
      description: presentation.description || '',
      mediaId: presentation.mediaId,
      countryIds: presentation.countries?.map(c => c.id) || [],
      order: presentation.order,
      active: presentation.active
    };
  } else {
    editingId.value = null;
    form.value = {
      title: '',
      description: '',
      mediaId: null,
      countryIds: [],
      order: presentations.value.length,
      active: true
    };
  }
  isModalOpen.value = true;
};



const saveItem = async () => {
  try {
    if (!form.value.mediaId) {
      alert('Please select a video');
      return;
    }
    if (form.value.countryIds.length === 0) {
      alert('Please select at least one country');
      return;
    }

    if (editingId.value) {
      await api.put(`/admin/presentations/${editingId.value}`, form.value);
    } else {
      await api.post('/admin/presentations', form.value);
    }

    isModalOpen.value = false;
    await loadPresentations();
  } catch (err) {
    console.error('Error saving presentation:', err);
    alert('Failed to save presentation');
  }
};

const requestDelete = (id) => {
  editingId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  try {
    await api.delete(`/admin/presentations/${editingId.value}`);
    confirmOpen.value = false;
    await loadPresentations();
  } catch (err) {
    console.error('Error deleting presentation:', err);
    alert('Failed to delete presentation');
  }
};

onMounted(async () => {
  await mediaStore.fetchAll();
  await loadPresentations();
});
</script>
