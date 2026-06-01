<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Testimonials Management</h3>
      <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add Testimonial
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Tag</th>
            <th class="p-4">Quote</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-950 text-gray-300">
          <tr v-for="item in contentStore.testimonials" :key="item.id" class="hover:bg-slate-900/30">
            <td class="p-4 font-bold text-white">{{ item.name }}</td>
            <td class="p-4 text-amber-500 font-mono">{{ item.lifestyleTag }}</td>
            <td class="p-4 truncate max-w-xs">{{ item.quote }}</td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-amber-400 hover:text-amber-300 transition">Edit</button>
              <button @click="handleDelete(item.id)" class="text-red-400 hover:text-red-300 transition">Delete</button>
            </td>
          </tr>
          <tr v-if="contentStore.testimonials.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-500">No testimonials found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2">
          {{ editingId ? 'Edit Testimonial' : 'New Testimonial' }}
        </h4>
        <form @submit.prevent="saveItem" class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Name</label>
            <input v-model="form.name" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Lifestyle Tag</label>
            <input v-model="form.lifestyleTag" placeholder="e.g. Student, Executive" class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Quote</label>
            <textarea v-model="form.quote" rows="3" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white"></textarea>
          </div>
          <MediaPicker v-model="form.mediaAssetId" label="Profile photo" />
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-900">
            <button type="button" @click="isModalOpen = false" class="text-gray-400 hover:text-white transition">Cancel</button>
            <button type="submit" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded transition">
              {{ editingId ? 'Save Changes' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useContentStore } from '../../stores/content';
import MediaPicker from './MediaPicker.vue';

const contentStore = useContentStore();

const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ name: '', lifestyleTag: '', quote: '', mediaAssetId: null });

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = { ...item };
  } else {
    editingId.value = null;
    form.value = { name: '', lifestyleTag: '', quote: '', mediaAssetId: null };
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

const handleDelete = async (id) => {
  if (confirm('Delete this testimonial?')) {
    await contentStore.adminDeleteTestimonial(id);
  }
};
</script>
