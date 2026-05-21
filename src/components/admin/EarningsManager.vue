<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Earning Streams Management</h3>
      <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add Stream
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
          <tr>
            <th class="p-4">Icon</th>
            <th class="p-4">Title</th>
            <th class="p-4">Short Description</th>
            <th class="p-4 text-center">Order Index</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-950 text-gray-300">
          <tr v-for="item in contentStore.earningStreams" :key="item.id" class="hover:bg-slate-900/30">
            <td class="p-4 text-xl">{{ item.icon }}</td>
            <td class="p-4 font-bold text-white">{{ item.title }}</td>
            <td class="p-4 truncate max-w-[200px]">{{ item.shortDescription }}</td>
            <td class="p-4 text-center font-mono text-amber-500">{{ item.orderIndex }}</td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-amber-400 hover:text-amber-300 transition">Edit</button>
              <button @click="handleDelete(item.id)" class="text-red-400 hover:text-red-300 transition">Delete</button>
            </td>
          </tr>
          <tr v-if="contentStore.earningStreams.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-500">No earning streams found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2">
          {{ editingId ? 'Edit Earning Stream' : 'New Earning Stream' }}
        </h4>
        <form @submit.prevent="saveItem" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Title</label>
              <input v-model="form.title" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
            </div>
            <div>
              <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Icon (Emoji)</label>
              <input v-model="form.icon" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
            </div>
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Short Description</label>
            <input v-model="form.shortDescription" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Long Description</label>
            <textarea v-model="form.longDescription" rows="3" class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white"></textarea>
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider font-bold mb-1">Order Index (1-10)</label>
            <input v-model="form.orderIndex" type="number" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 focus:border-amber-400 text-white" />
          </div>
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

const contentStore = useContentStore();

const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ title: '', shortDescription: '', longDescription: '', icon: '💰', orderIndex: 1 });

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = { ...item };
  } else {
    editingId.value = null;
    form.value = { title: '', shortDescription: '', longDescription: '', icon: '💰', orderIndex: 1 };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  if (editingId.value) {
    await contentStore.adminUpdateEarningStream(editingId.value, form.value);
  } else {
    await contentStore.adminCreateEarningStream(form.value);
  }
  isModalOpen.value = false;
};

const handleDelete = async (id) => {
  if (confirm('Delete this earning stream?')) {
    await contentStore.adminDeleteEarningStream(id);
  }
};
</script>
