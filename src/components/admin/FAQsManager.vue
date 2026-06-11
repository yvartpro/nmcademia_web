<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">FAQs</h3>
      <div class="flex gap-2 flex-grow sm:flex-grow-0">
        <input
          v-model="search"
          type="search"
          placeholder="Search questions…"
          class="flex-grow sm:w-48 bg-[#F4F6F5] border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:border-[#008A20] focus:outline-none text-[#0A0F0D]"
        />
        <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition shrink-0">
          + Add FAQ
        </button>
      </div>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4 w-12">#</th>
            <th class="p-4">Question</th>
            <th class="p-4 hidden lg:table-cell">Category</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="item in filtered" :key="item.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4 font-mono text-[#008A20] font-bold">{{ item.order }}</td>
            <td class="p-4">
              <p class="font-bold text-[#0A0F0D]">{{ item.question }}</p>
              <p class="text-zinc-400 mt-1 line-clamp-2">{{ item.answer }}</p>
            </td>
            <td class="p-4 hidden lg:table-cell text-zinc-400">{{ item.category }}</td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-[#008A20] hover:text-[#006616] font-semibold">Edit</button>
              <button @click="requestDelete(item.id)" class="text-red-500 hover:text-red-700 font-semibold">Delete</button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="p-6 text-center text-zinc-400">No FAQs match your search.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit FAQ' : 'New FAQ'" subtitle="Knowledge Base">
      <form id="faq-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="adm-field">
          <label class="adm-label">Question</label>
          <input v-model="form.question" required class="adm-input" />
        </div>
        <div class="adm-field">
          <label class="adm-label">Answer</label>
          <textarea v-model="form.answer" rows="5" required class="adm-input"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="adm-field">
            <label class="adm-label">Display order</label>
            <input v-model.number="form.order" type="number" class="adm-input" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Category</label>
            <input v-model="form.category" class="adm-input" />
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="faq-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create FAQ' }}
        </button>
      </template>
    </UiModal>

    <!-- Confirm Delete Modal -->
    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this FAQ?"
      message="This will permanently remove the question and its answer. This action cannot be undone."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useContentStore } from '../../stores/content';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';

const contentStore = useContentStore();
const search = ref('');
const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({ question: '', answer: '', order: 0, category: 'General' });

const confirmOpen = ref(false);
const pendingDeleteId = ref(null);

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

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await contentStore.adminDeleteFAQ(pendingDeleteId.value);
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
