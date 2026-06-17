<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Ways of Earning Management</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add Way
      </button>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4">Image</th>
            <th class="p-4">Title</th>
            <th class="p-4">Subtitle</th>
            <th class="p-4 text-center">Order</th>
            <th class="p-4 text-center">Active</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="item in contentStore.ways" :key="item.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4">
              <span v-if="item.image" class="block text-xs text-zinc-500 truncate max-w-[180px]">{{ item.image }}</span>
              <span v-else class="text-zinc-400">No image</span>
            </td>
            <td class="p-4 font-bold text-[#0A0F0D]">{{ item.title }}</td>
            <td class="p-4 text-zinc-500">{{ item.subtitle || '—' }}</td>
            <td class="p-4 text-center font-mono text-[#008A20] font-bold">{{ item.order }}</td>
            <td class="p-4 text-center">
              <span :class="item.active ? 'text-[#008A20] font-bold' : 'text-zinc-400'">{{ item.active ? 'Yes' : 'No' }}</span>
            </td>
            <td class="p-4 text-right space-x-2 shrink-0">
              <button @click="openModal(item)" class="text-[#008A20] hover:text-[#006616] font-semibold transition">Edit</button>
              <button @click="requestDelete(item.id)" class="text-red-500 hover:text-red-700 font-semibold transition">Delete</button>
            </td>
          </tr>
          <tr v-if="contentStore.ways.length === 0">
            <td colspan="6" class="p-6 text-center text-zinc-400">No ways of earning found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Way of Earning' : 'New Way of Earning'" subtitle="Compensation Plan" size="lg">
      <form id="ways-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-4">
          <div class="adm-field">
            <label class="adm-label">Title</label>
            <input v-model="form.title" required class="adm-input" @input="autoSlug" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Slug</label>
            <input v-model="form.slug" required class="adm-input font-mono" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="adm-field">
            <label class="adm-label">Subtitle</label>
            <input v-model="form.subtitle" class="adm-input" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Image path</label>
            <input v-model="form.image" placeholder="uploads/images/example.jpg" class="adm-input" />
          </div>
        </div>
        <div class="adm-field">
          <label class="adm-label">Description</label>
          <textarea v-model="form.bodyDescription" rows="3" class="adm-input"></textarea>
        </div>
        <div class="adm-field">
          <label class="adm-label">Bullet list</label>
          <textarea v-model="form.bodyBullets" rows="4" placeholder="One idea per line" class="adm-input"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="adm-field">
            <label class="adm-label">Display order</label>
            <input v-model.number="form.order" type="number" required class="adm-input" />
          </div>
          <div class="adm-field">
            <label class="flex items-center gap-2 text-zinc-600 cursor-pointer">
              <input v-model="form.active" type="checkbox" class="rounded accent-[#008A20]" />
              <span>Visible on presentation</span>
            </label>
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="ways-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create Way' }}
        </button>
      </template>
    </UiModal>

    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this way of earning?"
      message="This will permanently remove this way from the presentation and the public list."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useContentStore } from '../../stores/content';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';

const contentStore = useContentStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const form = ref({
  title: '',
  slug: '',
  subtitle: '',
  image: '',
  bodyDescription: '',
  bodyBullets: '',
  order: 1,
  active: true
});
const confirmOpen = ref(false);
const pendingDeleteId = ref(null);

onMounted(() => contentStore.fetchWaysAdmin());

const autoSlug = () => {
  if (!editingId.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
};

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = {
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle || '',
      image: item.image || '',
      bodyDescription: item.body?.description || '',
      bodyBullets: (item.body?.bullets || []).join('\n'),
      order: item.order ?? 1,
      active: item.active !== false
    };
  } else {
    editingId.value = null;
    const nextOrder = contentStore.ways.length
      ? Math.max(...contentStore.ways.map(s => s.order ?? 0)) + 1
      : 1;
    form.value = {
      title: '',
      slug: '',
      subtitle: '',
      image: '',
      bodyDescription: '',
      bodyBullets: '',
      order: nextOrder,
      active: true
    };
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  const payload = {
    title: form.value.title,
    slug: form.value.slug,
    subtitle: form.value.subtitle,
    image: form.value.image || null,
    body: {
      description: form.value.bodyDescription,
      bullets: form.value.bodyBullets
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
    },
    order: form.value.order,
    active: form.value.active
  };

  if (editingId.value) {
    await contentStore.adminUpdateWay(editingId.value, payload);
  } else {
    await contentStore.adminCreateWay(payload);
  }
  await contentStore.fetchWaysAdmin();
  isModalOpen.value = false;
};

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await contentStore.adminDeleteWay(pendingDeleteId.value);
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
