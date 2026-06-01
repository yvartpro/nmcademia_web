<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Registration packages</h3>
      <button @click="openModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add package
      </button>
    </div>

    <p class="text-gray-500 text-xs">Set entry price, referral bonus, and match bonus for each country where you operate.</p>

    <div class="space-y-4">
      <div
        v-for="pkg in catalogStore.packages"
        :key="pkg.id"
        class="bg-slate-950 border border-gray-900 rounded-xl p-5 shadow-lg"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <h4 class="font-bold text-white">{{ pkg.name }}</h4>
            <p class="text-gray-500 text-[10px] font-mono mt-0.5">{{ pkg.slug }}</p>
            <p class="text-gray-400 text-xs mt-2 line-clamp-2">{{ pkg.description }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="openModal(pkg)" class="text-amber-400 text-xs font-bold">Edit</button>
            <button @click="handleDelete(pkg.id)" class="text-red-400 text-xs font-bold">Delete</button>
          </div>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-[10px] text-left">
            <thead class="text-gray-500 uppercase">
              <tr>
                <th class="py-1 pr-3">Country</th>
                <th class="py-1 pr-3">Price</th>
                <th class="py-1 pr-3">Referral</th>
                <th class="py-1">Match</th>
              </tr>
            </thead>
            <tbody class="text-gray-300">
              <tr v-for="pr in pkg.prices || []" :key="pr.countryCode">
                <td class="py-1 pr-3 font-mono text-amber-500">{{ pr.countryCode }}</td>
                <td class="py-1 pr-3">{{ pr.price }}</td>
                <td class="py-1 pr-3">{{ pr.referralBonus }}</td>
                <td class="py-1">{{ pr.matchBonus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="max-w-2xl w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 my-8 shadow-2xl">
        <h4 class="text-lg font-bold text-amber-400 border-b border-gray-900 pb-2 mb-4">{{ editingId ? 'Edit' : 'New' }} package</h4>
        <form @submit.prevent="saveItem" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-gray-400 font-bold mb-1">Package name</label>
              <input v-model="form.name" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" @input="autoSlug" />
            </div>
            <div>
              <label class="block text-gray-400 font-bold mb-1">Slug</label>
              <input v-model="form.slug" required class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white" />
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 text-gray-300">
                <input v-model="form.featured" type="checkbox" class="rounded text-amber-400" />
                Featured
              </label>
            </div>
          </div>
          <div>
            <label class="block text-gray-400 font-bold mb-1">Description</label>
            <textarea v-model="form.description" rows="2" class="w-full bg-slate-900 border border-gray-800 rounded p-2 text-white"></textarea>
          </div>

          <div class="border-t border-gray-900 pt-4">
            <h5 class="text-amber-400 font-bold uppercase tracking-wider mb-3">Prices per country</h5>
            <div v-for="(row, idx) in form.prices" :key="idx" class="grid grid-cols-5 gap-2 mb-2 items-end">
              <div>
                <label class="text-[9px] text-gray-500">Country</label>
                <select v-model="row.countryCode" class="w-full bg-slate-900 border border-gray-800 rounded p-1.5 text-white">
                  <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">{{ c.code }}</option>
                </select>
              </div>
              <div>
                <label class="text-[9px] text-gray-500">Price</label>
                <input v-model.number="row.price" type="number" class="w-full bg-slate-900 border border-gray-800 rounded p-1.5 text-white" />
              </div>
              <div>
                <label class="text-[9px] text-gray-500">Referral</label>
                <input v-model.number="row.referralBonus" type="number" class="w-full bg-slate-900 border border-gray-800 rounded p-1.5 text-white" />
              </div>
              <div>
                <label class="text-[9px] text-gray-500">Match</label>
                <input v-model.number="row.matchBonus" type="number" class="w-full bg-slate-900 border border-gray-800 rounded p-1.5 text-white" />
              </div>
              <button type="button" @click="form.prices.splice(idx, 1)" class="text-red-400 py-1.5">×</button>
            </div>
            <button type="button" @click="addPriceRow" class="text-amber-400 text-[10px] font-bold mt-1">+ Add country price</button>
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

const form = ref({
  name: '',
  slug: '',
  description: '',
  featured: false,
  prices: []
});

onMounted(async () => {
  await catalogStore.adminFetchCountries();
  await catalogStore.fetchPackages();
});

const autoSlug = () => {
  if (!editingId.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
};

const addPriceRow = () => {
  const code = catalogStore.countries[0]?.code || 'NG';
  const country = catalogStore.countries.find(c => c.code === code);
  form.value.prices.push({
    countryCode: code,
    currency: country?.currency || 'NGN',
    price: 0,
    referralBonus: 0,
    matchBonus: 0
  });
};

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id;
    form.value = {
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      featured: !!item.featured,
      prices: (item.prices || []).map(p => ({ ...p }))
    };
  } else {
    editingId.value = null;
    form.value = { name: '', slug: '', description: '', featured: false, prices: [] };
    addPriceRow();
  }
  isModalOpen.value = true;
};

const saveItem = async () => {
  const payload = {
    name: form.value.name,
    slug: form.value.slug,
    description: form.value.description,
    featured: form.value.featured,
    prices: form.value.prices.map(p => ({
      countryCode: p.countryCode,
      currency: catalogStore.countries.find(c => c.code === p.countryCode)?.currency || p.currency,
      price: p.price,
      referralBonus: p.referralBonus,
      matchBonus: p.matchBonus
    }))
  };
  if (editingId.value) await catalogStore.adminUpdatePackage(editingId.value, payload);
  else await catalogStore.adminCreatePackage(payload);
  await catalogStore.fetchPackages();
  isModalOpen.value = false;
};

const handleDelete = async (id) => {
  if (confirm('Delete this package?')) {
    await catalogStore.adminDeletePackage(id);
  }
};
</script>
