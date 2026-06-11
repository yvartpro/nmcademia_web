<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Registration packages</h3>
      <button @click="openModal()" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold py-2 px-4 rounded-lg text-xs transition">
        + Add package
      </button>
    </div>

    <p class="text-zinc-500 text-xs">Set entry price, referral bonus, and match bonus for each country where you operate.</p>

    <div class="space-y-4">
      <div
        v-for="pkg in catalogStore.packages"
        :key="pkg.id"
        class="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <h4 class="font-bold text-[#0A0F0D]">{{ pkg.name }}</h4>
            <p class="text-zinc-400 text-[10px] font-mono mt-0.5">{{ pkg.slug }}</p>
            <p class="text-zinc-500 text-xs mt-2 line-clamp-2">{{ pkg.description }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="openModal(pkg)" class="text-[#008A20] text-xs font-bold hover:text-[#006616] transition">Edit</button>
            <button @click="requestDelete(pkg.id)" class="text-red-500 text-xs font-bold hover:text-red-700 transition">Delete</button>
          </div>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-[10px] text-left">
            <thead class="text-zinc-400 uppercase font-bold">
              <tr>
                <th class="py-1 pr-3">Country</th>
                <th class="py-1 pr-3">Price</th>
                <th class="py-1 pr-3">Referral</th>
                <th class="py-1">Match</th>
              </tr>
            </thead>
            <tbody class="text-zinc-600">
              <tr v-for="pr in pkg.prices || []" :key="pr.countryCode">
                <td class="py-1 pr-3 font-mono text-[#008A20] font-bold">{{ pr.countryCode }}</td>
                <td class="py-1 pr-3">{{ pr.price }}</td>
                <td class="py-1 pr-3">{{ pr.referralBonus }}</td>
                <td class="py-1">{{ pr.matchBonus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <UiModal v-model="isModalOpen" :title="editingId ? 'Edit Package' : 'New Package'" subtitle="Entry Level Catalog" size="xl">
      <form id="package-form" @submit.prevent="saveItem" class="space-y-5 text-xs">
        <!-- Basic info -->
        <div class="grid grid-cols-2 gap-3">
          <div class="adm-field col-span-2">
            <label class="adm-label">Package name</label>
            <input v-model="form.name" required class="adm-input" @input="autoSlug" />
          </div>
          <div class="adm-field">
            <label class="adm-label">Slug</label>
            <input v-model="form.slug" required class="adm-input font-mono" />
          </div>
          <div class="adm-field flex-row items-center gap-3 pt-5">
            <label class="flex items-center gap-2 text-zinc-600 cursor-pointer">
              <input v-model="form.featured" type="checkbox" class="rounded accent-[#008A20]" />
              <span>Featured package</span>
            </label>
          </div>
        </div>

        <div class="adm-field">
          <label class="adm-label">Description</label>
          <textarea v-model="form.description" rows="2" class="adm-input"></textarea>
        </div>

        <!-- Prices section -->
        <div class="border border-zinc-200 rounded-xl overflow-hidden">
          <div class="flex items-center justify-between p-3 bg-[#F4F6F5] border-b border-zinc-200">
            <h5 class="text-[#008A20] font-bold uppercase tracking-wider text-[10px]">Prices per country</h5>
            <button type="button" @click="addPriceRow" class="text-[#008A20] text-[10px] font-bold hover:text-[#006616] transition">
              + Add country
            </button>
          </div>

          <div class="divide-y divide-zinc-100">
            <div v-for="(row, idx) in form.prices" :key="idx" class="p-3 grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
              <div class="adm-field">
                <label class="adm-label">Country</label>
                <select v-model="row.countryCode" class="adm-input adm-select">
                  <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">{{ c.code }}</option>
                </select>
              </div>
              <div class="adm-field">
                <label class="adm-label">Price</label>
                <input v-model.number="row.price" type="number" class="adm-input" />
              </div>
              <div class="adm-field">
                <label class="adm-label">Referral</label>
                <input v-model.number="row.referralBonus" type="number" class="adm-input" />
              </div>
              <div class="adm-field">
                <label class="adm-label">Match</label>
                <input v-model.number="row.matchBonus" type="number" class="adm-input" />
              </div>
              <button
                type="button"
                @click="form.prices.splice(idx, 1)"
                class="pb-1 text-red-400 hover:text-red-600 transition text-base leading-none self-end"
                title="Remove row"
              >×</button>
            </div>
            <div v-if="form.prices.length === 0" class="p-4 text-center text-zinc-400 text-[10px]">
              No country prices yet. Click "+ Add country" above.
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" class="adm-btn-ghost" @click="isModalOpen = false">Cancel</button>
        <button type="submit" form="package-form" class="adm-btn-primary">
          {{ editingId ? 'Save Changes' : 'Create Package' }}
        </button>
      </template>
    </UiModal>

    <!-- Confirm Delete -->
    <UiConfirmModal
      v-model="confirmOpen"
      title="Delete this package?"
      message="This will permanently remove the package and all its country pricing data. This cannot be undone."
      confirm-label="Yes, Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCatalogStore } from '../../stores/catalog';
import UiModal from '../ui/UiModal.vue';
import UiConfirmModal from '../ui/UiConfirmModal.vue';

const catalogStore = useCatalogStore();
const isModalOpen = ref(false);
const editingId = ref(null);
const confirmOpen = ref(false);
const pendingDeleteId = ref(null);

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

const requestDelete = (id) => {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
};

const executeDelete = async () => {
  if (pendingDeleteId.value) await catalogStore.adminDeletePackage(pendingDeleteId.value);
  pendingDeleteId.value = null;
};
</script>

<style scoped>
.adm-field { display: flex; flex-direction: column; gap: 0.25rem; }
.adm-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; }
.adm-input {
  width: 100%;
  background: #F4F6F5;
  border: 1px solid #e4e4e7;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #0A0F0D;
  font-size: 0.75rem;
  outline: none;
  transition: border-color 0.15s;
}
.adm-input:focus { border-color: #008A20; }
.adm-select { appearance: auto; cursor: pointer; }
.adm-btn-ghost { font-size: 0.75rem; font-weight: 700; color: #6b7280; background: transparent; border: 1px solid #e4e4e7; cursor: pointer; padding: 0.5rem 0.875rem; border-radius: 0.5rem; transition: color 0.15s, border-color 0.15s; }
.adm-btn-ghost:hover { color: #0A0F0D; border-color: #a1a1aa; }
.adm-btn-primary { font-size: 0.75rem; font-weight: 800; background: #008A20; color: #fff; padding: 0.55rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: filter 0.15s; }
.adm-btn-primary:hover { filter: brightness(1.1); }
</style>
