<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Products</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add product
      </button>
    </div>

    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 text-zinc-600">
          <tr v-for="p in catalogStore.products" :key="p.id" class="hover:bg-[#F4F6F5]/60 transition">
            <td class="p-4 font-bold text-[#0A0F0D]">{{ p.name }}</td>
            <td class="p-4">{{ p.category }}</td>
            <td class="p-4 font-mono">{{ p.price }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(p)" class="text-[#008A20] hover:text-[#006616] transition font-semibold">Edit</button>
              <button @click="requestDelete(p.id)" class="text-red-500 hover:text-red-700 transition font-semibold">Delete</button>
            </td>
          </tr>
          <tr v-if="catalogStore.products.length === 0">
            <td colspan="4" class="p-6 text-center text-zinc-400">No products yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Product' : 'New Product'" subtitle="Catalog" size="lg">
      <form id="product-form" @submit.prevent="saveItem" class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div class="adm-field col-span-2">
            <label class="adm-label">Name</label>
            <input v-model="form.name" required class="adm-input" @input="autoSlug" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Slug</label>
            <input v-model="form.slug" required class="adm-input" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Category</label>
            <input v-model="form.category" class="adm-input" />
          </div>
        </div>
        <div class="adm-field">
          <label class="adm-label">Scientific name (optional)</label>
          <input v-model="form.scientificName" class="adm-input" />
        </div>
        <div class="adm-field">
          <label class="adm-label">Description</label>
          <textarea v-model="form.description" rows="3" class="adm-input"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3 items-end">
          <div class="adm-field">
            <label class="adm-label">Display price</label>
            <input v-model.number="form.price" type="number" step="0.01" class="adm-input" />
          </div>
          <label class="flex items-center gap-2 text-zinc-600 cursor-pointer pb-1">
            <input v-model="form.featured" type="checkbox" class="rounded accent-[#008A20]" />
            <span class="text-xs">Featured on presentation</span>
          </label>
        </div>
        <MediaPicker v-model="form.mediaAssetId" label="Product image" />
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="product-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create Product' }}
        </button>
      </template>
    </UiModal>

    <!-- Confirm Delete -->
    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this product?"
      message="This will permanently remove the product from your catalog."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCatalogStore } from '../../stores/catalog';
import MediaPicker from './MediaPicker.vue';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';

const catalogStore = useCatalogStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const slugTouched = ref(false);
const confirmOpen = ref(false);
const pendingDeleteId = ref(null);

const emptyForm = () => ({
  name: '',
  slug: '',
  scientificName: '',
  category: 'Food Supplements',
  description: '',
  price: 0,
  featured: false,
  mediaAssetId: null
});

const form = ref(emptyForm());

onMounted(() => catalogStore.fetchProducts());

const autoSlug = () => {
  if (!slugTouched.value && !editingId.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
};

const openModal = (item = null) => {
  slugTouched.value = false;
  if (item) {
    editingId.value = item.id;
    form.value = {
      name: item.name,
      slug: item.slug,
      scientificName: item.scientificName || '',
      category: item.category || '',
      description: item.description || '',
      price: Number(item.price) || 0,
      featured: !!item.featured,
      mediaAssetId: item.mediaAssetId || null
    };
  } else {
    editingId.value = null;
    form.value = emptyForm();
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  const payload = { ...form.value, mediaAssetId: form.value.mediaAssetId || null };
  if (editingId.value) await catalogStore.adminUpdateProduct(editingId.value, payload);
  else await catalogStore.adminCreateProduct(payload);
  await catalogStore.fetchProducts();
  isModalOpen.value = false;
};

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await catalogStore.adminDeleteProduct(pendingDeleteId.value);
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
