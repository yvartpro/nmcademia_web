<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Testimonials Management</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add Testimonial
      </button>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4">Media</th>
            <th class="p-4">Name</th>
            <th class="p-4">Tag</th>
            <th class="p-4">Quote</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="item in contentStore.testimonials" :key="item.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4">
              <div class="w-16 h-12 rounded overflow-hidden bg-zinc-100 flex items-center justify-center">
                <img v-if="item.video && item.video.thumbnailPath" :src="$stores.media.resolveUrl(item.video.thumbnailPath)" class="w-full h-full object-cover" />
                <img v-else-if="item.photo && item.photo.thumbnailPath" :src="$stores.media.resolveUrl(item.photo.thumbnailPath)" class="w-full h-full object-cover" />
                <div v-else class="text-sm">—</div>
              </div>
            </td>
            <td class="p-4 font-bold text-[#0A0F0D]">{{ item.name }}</td>
            <td class="p-4 text-[#008A20] font-mono font-semibold">{{ item.lifestyleTag }}</td>
            <td class="p-4 truncate max-w-xs">{{ item.quote }}</td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-[#008A20] hover:text-[#006616] font-semibold transition">Edit</button>
              <button @click="requestDelete(item.id)" class="text-red-500 hover:text-red-700 font-semibold transition">Delete</button>
            </td>
          </tr>
          <tr v-if="contentStore.testimonials.length === 0">
            <td colspan="4" class="p-6 text-center text-zinc-400">No testimonials found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Testimonial' : 'New Testimonial'" subtitle="Success Stories">
      <form id="testimonial-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="adm-field">
          <label class="adm-label">Name</label>
          <input v-model="form.name" required class="adm-input" />
        </div>
        <div class="adm-field">
          <label class="adm-label">Lifestyle Tag</label>
          <input v-model="form.lifestyleTag" placeholder="e.g. Student, Executive" class="adm-input" />
        </div>
        <div class="adm-field">
          <label class="adm-label">Quote</label>
          <textarea v-model="form.quote" rows="3" required class="adm-input"></textarea>
        </div>
        <MediaPicker v-model="form.mediaAssetId" assetType="image" label="Profile photo" />
        <MediaPicker v-model="form.videoAssetId" assetType="video" label="Video (optional)" />
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="testimonial-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create' }}
        </button>
      </template>
    </UiModal>

    <!-- Confirm Delete -->
    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this testimonial?"
      message="This will permanently remove the testimonial. This action cannot be undone."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useContentStore } from '../../stores/content';
import MediaPicker from './MediaPicker.vue';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';

const contentStore = useContentStore();

const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ name: '', lifestyleTag: '', quote: '', mediaAssetId: null, videoAssetId: null });

const confirmOpen = ref(false);
const pendingDeleteId = ref(null);

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = { ...item };
  } else {
    editingId.value = null;
    form.value = { name: '', lifestyleTag: '', quote: '', mediaAssetId: null, videoAssetId: null };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  if (editingId.value) {
    await contentStore.adminUpdateTestimonial(editingId.value, form.value);
  } else {
    await contentStore.adminCreateTestimonial(form.value);
  }
  isModalOpen.value = false;
};

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await contentStore.adminDeleteTestimonial(pendingDeleteId.value);
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
