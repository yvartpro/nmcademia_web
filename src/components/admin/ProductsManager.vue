<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Products</h3>
      <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add product
      </button>
    </div>

    <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-950 text-gray-300">
          <tr v-for="p in catalogStore.products" :key="p.id" class="hover:bg-slate-900/30">
            <td class="p-4 font-bold text-white">{{ p.name }}</td>
            <td class="p-4">{{ p.category }}</td>
            <td class="p-4 font-mono">{{ p.price }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(p)" class="text-amber-400">Edit</button>
              <button @click="handleDelete(p.id)" class="text-red-400">Delete</button>
            </td>
          </tr>
          <tr v-if="catalogStore.products.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-500">No products yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="max-w-lg w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 my-8 shadow-2xl">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2 mb-4">{{ editingId ? 'Edit' : 'New' }} product</h4>
        <form @submit.prevent="saveItem" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-gray-400 font-bold mb-1">Name</label>
              <input v-model="form.name" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" @input="autoSlug" />
            </div>
            <div>
              <label class="block text-gray-400 font-bold mb-1">Slug</label>
              <input v-model="form.slug" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
            </div>
            <div>
              <label class="block text-gray-400 font-bold mb-1">Category</label>
              <input v-model="form.category" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
            </div>
          </div>
          <div>
            <label class="block text-gray-400 font-bold mb-1">Scientific name (optional)</label>
            <input v-model="form.scientificName" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
          </div>
          <div>
            <label class="block text-gray-400 font-bold mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-400 font-bold mb-1">Display price</label>
              <input v-model.number="form.price" type="number" step="0.01" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
            </div>
            <div class="flex items-end pb-2">
              <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input v-model="form.featured" type="checkbox" class="rounded text-amber-400" />
                Featured on presentation
              </label>
            </div>
          </div>
          <MediaPicker v-model="form.mediaAssetId" label="Product image" />
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
import MediaPicker from './MediaPicker.vue';

const catalogStore = useCatalogStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const slugTouched = ref(false);

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

const handleDelete = async (id) => {
  if (confirm('Delete this product?')) {
    await catalogStore.adminDeleteProduct(id);
  }
};
</script>
