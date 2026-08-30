<template>
  <div class="min-h-screen bg-surface-0 text-zinc-900 pb-28 nma-gradient-mesh font-sans relative overflow-x-hidden">

    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-accent transition"
        >
          ← Back to Presentation
        </button>
        <div class="flex items-center gap-2 bg-zinc-100 rounded-xl px-3 py-1.5 border border-zinc-200">
          <CountrySelect
            v-model="selectedCountryCode"
            compact
            show-currency
            :full-width="false"
            @change="changeCountry"
          />
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      <div v-if="!loaded" class="text-center py-20 text-zinc-500">
        <p>Loading product details...</p>
      </div>

      <div v-else-if="!product" class="text-center py-20 space-y-3">
        <div class="text-5xl">📦</div>
        <p class="font-semibold text-zinc-600">This product could not be found.</p>
        <p class="text-xs text-zinc-400">It may have been removed from the catalog.</p>
        <UiButton variant="outline" size="sm" class="mt-4" @click="goBack">Back to Presentation</UiButton>
      </div>

      <div v-else class="space-y-10 animate-fade-in">

        <!-- Hero: image + summary -->
        <div class="nma-card-glass overflow-hidden border border-zinc-200/50">
          <div class="grid md:grid-cols-2 gap-0">
            <div class="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-zinc-100">
              <img
                v-if="product.image"
                :src="getFullMediaUrl(product.image)"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full min-h-[240px] flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                <span class="text-7xl opacity-30">📦</span>
              </div>
              <div v-if="product.featured" class="absolute top-4 left-4">
                <span class="text-[10px] font-black uppercase tracking-wide bg-accent text-white px-3 py-1 rounded-full shadow">
                  Featured
                </span>
              </div>
            </div>

            <div class="p-6 sm:p-8 flex flex-col justify-center space-y-5">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span v-if="product.category" class="text-[10px] font-bold uppercase tracking-widest text-accent/80">
                    {{ product.category }}
                  </span>
                  <span v-if="product.scientificName" class="text-[10px] font-mono text-zinc-400 italic">
                    {{ product.scientificName }}
                  </span>
                </div>
                <h1 class="text-3xl sm:text-4xl font-display font-black leading-tight text-zinc-950">
                  {{ product.name }}
                </h1>
              </div>

              <p class="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                {{ product.description || 'Part of the curated product assortment included in your entry package.' }}
              </p>

              <div class="pt-2 border-t border-zinc-200/60">
                <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Display price in {{ selectedCountryCode }}</span>
                <p class="text-3xl sm:text-4xl font-black text-accent mt-1">
                  {{ currencySymbol }}{{ formatNumber(product.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick facts -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-1">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Category</span>
            <p class="text-lg font-black text-zinc-950">{{ product.category || 'General' }}</p>
          </div>

          <div class="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-1">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Scientific name</span>
            <p class="text-lg font-black text-zinc-950">{{ product.scientificName || '—' }}</p>
          </div>

          <div class="p-5 bg-white border border-accent/20 rounded-2xl shadow-sm space-y-1 bg-accent/[0.03]">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Display price</span>
            <p class="text-lg font-black text-accent">{{ currencySymbol }}{{ formatNumber(product.price) }}</p>
          </div>
        </div>

        <!-- Full description -->
        <div v-if="product.description" class="nma-card-glass p-6 sm:p-8 space-y-4 border border-zinc-200/50">
          <h3 class="text-lg font-display font-extrabold text-zinc-900">About this product</h3>
          <p class="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">{{ product.description }}</p>
        </div>

        <!-- CTA -->
        <div class="rounded-2xl p-6 sm:p-8 text-center space-y-5 border border-accent/20 bg-gradient-to-br from-white to-accent/[0.06] shadow-sm">
          <h3 class="font-display font-extrabold text-xl text-zinc-900">Interested in {{ product.name }}?</h3>
          <p class="text-sm text-zinc-600 max-w-md mx-auto">
            This product is part of our assortment. Speak with your trainer to get matched with the right package.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <UiButton variant="primary" @click="consultTrainer">
              Order
            </UiButton>
            <UiButton variant="outline" @click="goBack">
              Back to Presentation
            </UiButton>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CountrySelect from '../components/ui/CountrySelect.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { getFullMediaUrl } from '../api';

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();

const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');
const loaded = ref(false);

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    catalogStore.fetchProducts(),
    settingsStore.fetchSettings(),
  ]);

  if (catalogStore.countries.length > 0 && !catalogStore.countries.some((c) => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }
  loaded.value = true;
});

const product = computed(() => catalogStore.products.find((p) => p.slug === route.params.slug));

const selectedCountryName = computed(() => catalogStore.selectedCountry?.name || 'Your Country');
const currencySymbol = computed(() => catalogStore.selectedCountry?.currencySymbol || '₦');

const changeCountry = () => {
  catalogStore.selectCountry(selectedCountryCode.value);
};

const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const goBack = () => {
  if (!sessionStorage.getItem('presentation_slide')) {
    sessionStorage.setItem('presentation_slide', '3');
  }
  router.push('/presentation');
};

const consultTrainer = () => {
  if (!product.value) return;
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  const text = encodeURIComponent(
    `Hello Trainer, I am interested in the ${product.value.name} (${currencySymbol.value}${formatNumber(product.value.price)}) in ${selectedCountryName.value}. Please guide me on how to get it.`
  );
  window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
};
</script>

<style scoped>
select option {
  background-color: #ffffff;
  color: #1f2937;
}
.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>