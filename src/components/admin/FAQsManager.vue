<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">FAQs</h3>
      <div class="flex gap-2 flex-grow sm:flex-grow-0">
        <input
          v-model="search"
          type="search"
          placeholder="Search questions…"
          class="flex-grow sm:w-48 bg-slate-900 border border-gray-800 rounded-lg px-3 py-2 text-xs focus:border-amber-400 text-white"
        />
        <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition shrink-0">
          + Add FAQ
        </button>
      </div>
    </div>

    <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
          <tr>
            <th class="p-4 w-12">#</th>
            <th class="p-4">Question</th>
            <th class="p-4 hidden lg:table-cell">Category</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-950 text-gray-300">
          <tr v-for="item in filtered" :key="item.id" class="hover:bg-slate-900/30">
            <td class="p-4 font-mono text-amber-500">{{ item.order }}</td>
            <td class="p-4">
              <p class="font-bold text-white">{{ item.question }}</p>
              <p class="text-gray-500 mt-1 line-clamp-2">{{ item.answer }}</p>
            </td>
            <td class="p-4 hidden lg:table-cell text-gray-500">{{ item.category }}</td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-amber-400 hover:text-amber-300">Edit</button>
              <button @click="handleDelete(item.id)" class="text-red-400 hover:text-red-300">Delete</button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-500">No FAQs match your search.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="max-w-lg w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2">
          {{ editingId ? 'Edit FAQ' : 'New FAQ' }}
        </h4>
        <form @submit.prevent="saveItem" class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-400 uppercase font-bold mb-1">Question</label>
            <input v-model="form.question" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white focus:border-amber-400" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase font-bold mb-1">Answer</label>
            <textarea v-model="form.answer" rows="5" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white focus:border-amber-400"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 uppercase font-bold mb-1">Display order</label>
              <input v-model.number="form.order" type="number" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white focus:border-amber-400" />
            </div>
            <div>
              <label class="block text-gray-400 uppercase font-bold mb-1">Category</label>
              <input v-model="form.category" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white focus:border-amber-400" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-900">
            <button type="button" @click="isModalOpen = false" class="text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useContentStore } from '../../stores/content';

const contentStore = useContentStore();
const search = ref('');
const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ question: '', answer: '', order: 0, category: 'General' });

onMounted(() => contentStore.fetchFAQs());

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return contentStore.faqs;
  return contentStore.faqs.filter(
    f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = { question: item.question, answer: item.answer, order: item.order ?? 0, category: item.category || 'General' };
  } else {
    editingId.value = null;
    const nextOrder = contentStore.faqs.length ? Math.max(...contentStore.faqs.map(f => f.order ?? 0)) + 1 : 0;
    form.value = { question: '', answer: '', order: nextOrder, category: 'General' };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  if (editingId.value) await contentStore.adminUpdateFAQ(editingId.value, form.value);
  else await contentStore.adminCreateFAQ(form.value);
  isModalOpen.value = false;
};

const handleDelete = async (id) => {
  if (confirm('Delete this FAQ?')) await contentStore.adminDeleteFAQ(id);
};
</script>
