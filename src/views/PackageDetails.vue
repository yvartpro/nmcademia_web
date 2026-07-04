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
          <Globe :size="14" class="text-zinc-500" />
          <select
            v-model="selectedCountryCode"
            @change="changeCountry"
            class="bg-transparent text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
              {{ c.code }} ({{ c.currencySymbol }})
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      <div v-if="!pkg" class="text-center py-20 text-zinc-500">
        <p>Loading package details...</p>
      </div>

      <div v-else-if="!currentPrice" class="text-center py-20 space-y-3">
        <div class="text-5xl">🌍</div>
        <p class="font-semibold text-zinc-600">{{ pkg.name }} is not available in {{ selectedCountryCode }}.</p>
        <p class="text-xs text-zinc-400">Switch country in the top bar to view pricing.</p>
        <UiButton variant="outline" size="sm" class="mt-4" @click="goBack">Back to Presentation</UiButton>
      </div>

      <div v-else class="space-y-10 animate-fade-in">

        <!-- Hero: image + summary -->
        <div class="nma-card-glass overflow-hidden border border-zinc-200/50">
          <div class="grid md:grid-cols-2 gap-0">
            <div class="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-zinc-100">
              <img
                v-if="pkg.image"
                :src="getFullMediaUrl(pkg.image)"
                :alt="pkg.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full min-h-[240px] flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                <span class="text-7xl opacity-30">📦</span>
              </div>
              <div v-if="pkg.featured" class="absolute top-4 left-4">
                <span class="text-[10px] font-black uppercase tracking-wide bg-accent text-white px-3 py-1 rounded-full shadow">
                  Featured Package
                </span>
              </div>
            </div>

            <div class="p-6 sm:p-8 flex flex-col justify-center space-y-5">
              <div class="space-y-2">
                <span class="text-[10px] font-bold uppercase tracking-widest text-accent/80">Academy Entry Level</span>
                <h1 class="text-3xl sm:text-4xl font-display font-black leading-tight text-zinc-950">
                  {{ pkg.name }}
                </h1>
              </div>

              <p class="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                {{ pkg.description || 'Curated entry package for building network marketing success.' }}
              </p>

              <div class="pt-2 border-t border-zinc-200/60">
                <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Investment in {{ selectedCountryCode }}</span>
                <p class="text-3xl sm:text-4xl font-black text-accent mt-1">
                  {{ currencySymbol }}{{ formatNumber(currentPrice.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Compensation metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-1">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Direct Referral</span>
            <p class="text-xl font-black text-zinc-950">
              {{ currencySymbol }}{{ formatNumber(currentPrice.referralBonus) }}
            </p>
            <p class="text-[11px] text-zinc-500 leading-relaxed">Earned for each direct referral at this level.</p>
          </div>

          <div class="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-1">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Pairing Match</span>
            <p class="text-xl font-black text-zinc-950">
              {{ currencySymbol }}{{ formatNumber(currentPrice.matchBonus) }}
            </p>
            <p class="text-[11px] text-zinc-500 leading-relaxed">Earned when both legs of your binary fill.</p>
          </div>

          <div class="p-5 bg-white border border-accent/20 rounded-2xl shadow-sm space-y-1 bg-accent/[0.03]">
            <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Account Slots</span>
            <p class="text-xl font-black text-accent">
              {{ headsCount }} {{ headsCount === 1 ? 'Head' : 'Heads' }}
            </p>
            <p class="text-[11px] text-zinc-500 leading-relaxed">Multiplies your cycle earning potential.</p>
          </div>
        </div>

        <!-- Leverage explanation -->
        <div class="nma-card-glass p-6 sm:p-8 space-y-5 border border-zinc-200/50">
          <h3 class="text-lg font-display font-extrabold text-zinc-900">
            Leverage & Account Duplication
          </h3>

          <div class="space-y-3 text-sm leading-relaxed text-zinc-600">
            <p>
              Each entry package registers a set number of <strong>heads / slots</strong> in the binary matrix.
              A single-slot package gives you one left and one right branch.
            </p>
            <p>
              <strong>{{ pkg.name }}</strong> unlocks <strong>{{ headsCount }} structural account{{ headsCount > 1 ? 's' : '' }}</strong>,
              letting you earn multiple times on the same group activity.
            </p>
          </div>

          <div class="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/80">
            <div class="px-4 py-3 bg-zinc-100 border-b border-zinc-200">
              <h4 class="font-bold text-xs uppercase tracking-wide text-zinc-600">Cycle earnings simulation</h4>
            </div>
            <div class="p-4 space-y-2.5 text-sm">
              <div class="flex justify-between">
                <span class="text-zinc-500">Base pairing value</span>
                <span class="font-mono text-zinc-800">{{ currencySymbol }}{{ formatNumber(currentPrice.matchBonus) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-500">Heads multiplier</span>
                <span class="font-mono font-bold text-accent">×{{ headsCount }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-zinc-200">
                <span class="font-semibold text-zinc-800">Potential cycle earnings</span>
                <span class="font-mono font-black text-accent">
                  {{ currencySymbol }}{{ formatNumber(potentialCycleEarnings) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Products included -->
        <div class="space-y-5">
          <div>
            <h3 class="text-lg font-display font-extrabold text-zinc-950">Product Assortment Included</h3>
            <p class="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
              Physical supplements and essentials matching or exceeding your investment value.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="product in catalogStore.products"
              :key="product.id"
              class="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-accent/30 transition"
            >
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center">
                <img
                  v-if="product.image"
                  :src="getFullMediaUrl(product.image)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-zinc-400 font-bold text-xs">{{ product.name.substring(0, 2) }}</span>
              </div>
              <div class="min-w-0">
                <h4 class="font-bold text-sm text-zinc-900">{{ product.name }}</h4>
                <p v-if="product.description" class="text-xs text-zinc-500 mt-0.5 line-clamp-2">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="rounded-2xl p-6 sm:p-8 text-center space-y-5 border border-accent/20 bg-gradient-to-br from-white to-accent/[0.06] shadow-sm">
          <h3 class="font-display font-extrabold text-xl text-zinc-900">Ready to secure your position?</h3>
          <p class="text-sm text-zinc-600 max-w-md mx-auto">
            Send an enrollment request to your trainer and get guided on binary tree placement.
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Globe } from 'lucide-vue-next';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import UiButton from '../components/ui/UiButton.vue';
import { getFullMediaUrl } from '../api';

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();

const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    catalogStore.fetchPackages(),
    catalogStore.fetchProducts(),
    settingsStore.fetchSettings(),
  ]);

  if (catalogStore.countries.length > 0 && !catalogStore.countries.some((c) => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }
});

const pkg = computed(() => catalogStore.packages.find((p) => p.slug === route.params.slug));

const currentPrice = computed(() =>
  pkg.value?.prices?.find((p) => p.countryCode === selectedCountryCode.value) ?? null
);

const selectedCountryName = computed(() => catalogStore.selectedCountry?.name || 'Your Country');
const currencySymbol = computed(() => catalogStore.selectedCountry?.currencySymbol || '₦');

const headsCount = computed(() => {
  if (!pkg.value) return 1;
  const s = pkg.value.slug.toLowerCase();
  if (s.includes('entriverse') || s.includes('global')) return 1;
  if (s.includes('neoverse')) return 3;
  if (s.includes('technoverse')) return 7;
  if (s.includes('digiverse')) return 15;
  if (s.includes('megaverse')) return 31;
  if (s.includes('maxiverse')) return 63;
  return 1;
});

const potentialCycleEarnings = computed(() => {
  if (!currentPrice.value) return 0;
  return Number(currentPrice.value.matchBonus) * headsCount.value;
});

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
    sessionStorage.setItem('presentation_slide', '9');
  }
  router.push('/presentation');
};

const consultTrainer = () => {
  if (!pkg.value || !currentPrice.value) return;
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  const text = encodeURIComponent(
    `Hello Trainer, I am ready to enroll with the ${pkg.value.name} (${currencySymbol.value}${formatNumber(currentPrice.value.price)}) in ${selectedCountryName.value}. Please guide me on structural positioning.`
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
