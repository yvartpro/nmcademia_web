<template>
  <div class="min-h-screen bg-[#070a13] text-white pb-28 nma-gradient-mesh font-sans relative overflow-x-hidden">
    
    <!-- Top Header Navigation -->
    <header class="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a13]/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button 
          @click="goBack" 
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-amber-400 transition"
        >
          ← Back to Presentation
        </button>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-zinc-900 rounded-xl px-3 py-1.5 border border-white/5">
            <Globe :size="14" class="text-zinc-400" />
            <select
              v-model="selectedCountryCode"
              @change="changeCountry"
              class="bg-transparent text-xs font-semibold text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.code }} ({{ c.currencySymbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      <!-- Loading State -->
      <div v-if="!pkg" class="text-center py-20 text-gray-500">
        <p>Loading package details...</p>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-10 animate-fade-in">
        
        <!-- Package Hero Header -->
        <div class="nma-card-glass p-8 space-y-6 relative overflow-hidden border-amber-500/20">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-1">
              <span class="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                {{ pkg.featured ? '★ Featured Package' : 'Academy Entry Level' }}
              </span>
              <h1 class="text-3xl sm:text-4xl font-display font-black leading-tight text-white mt-3">
                {{ pkg.name }}
              </h1>
              <p class="text-xs text-zinc-400 font-mono">Slug: {{ pkg.slug }}</p>
            </div>
            
            <div class="text-left md:text-right">
              <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Investment Cost</span>
              <p class="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                {{ currencySymbol }}{{ formatNumber(currentPrice?.price) }}
              </p>
            </div>
          </div>

          <p class="text-sm sm:text-base text-zinc-300 leading-relaxed font-light whitespace-pre-line border-t border-white/5 pt-6">
            {{ pkg.description || 'Curated entry package for building network marketing success.' }}
          </p>
        </div>

        <!-- Compensation Benefits Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-6 bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300">
            <span class="text-2xl block mb-2">🤝</span>
            <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Direct Referral Bonus</span>
            <p class="text-xl font-black text-white mt-1">
              {{ currencySymbol }}{{ formatNumber(currentPrice?.referralBonus) }}
            </p>
            <p class="text-[10px] text-zinc-400 mt-1 leading-relaxed">Earned instantly for every direct referral who starts at this level.</p>
          </div>

          <div class="p-6 bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300">
            <span class="text-2xl block mb-2">🔁</span>
            <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Pairing Match Commission</span>
            <p class="text-xl font-black text-white mt-1">
              {{ currencySymbol }}{{ formatNumber(currentPrice?.matchBonus) }}
            </p>
            <p class="text-[10px] text-zinc-400 mt-1 leading-relaxed">Earned whenever someone is placed left and right under your system.</p>
          </div>

          <div class="p-6 bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300">
            <span class="text-2xl block mb-2">👑</span>
            <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Accounts Multiplier</span>
            <p class="text-xl font-black text-amber-500 mt-1">
              {{ headsCount }} {{ headsCount === 1 ? 'Head' : 'Heads / Accounts' }}
            </p>
            <p class="text-[10px] text-zinc-400 mt-1 leading-relaxed">Multiplies the same $32 earning cycle potential by {{ headsCount }} slots.</p>
          </div>
        </div>

        <!-- How it Benefits You: Multiplier Explanation -->
        <div class="nma-card-glass p-6 sm:p-8 space-y-6">
          <h3 class="text-lg font-display font-extrabold text-amber-400 flex items-center gap-2">
            <span>🚀</span> Leverage & Account Duplication Potential
          </h3>

          <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-350">
            <p>
              In our binary compensation matrix, each entry package registers a set number of <strong>Heads / Slots</strong>. A single Global package sets up 1 position, meaning you only have 2 branches (Left and Right).
            </p>
            <p>
              With <strong>{{ pkg.name }}</strong>, you unlock <strong>{{ headsCount }} structural accounts</strong>. This sets up a pre-structured matrix where you earn multiple times on the same group sales activity!
            </p>
          </div>

          <!-- Earnings Simulation Comparison Table -->
          <div class="border border-white/5 rounded-xl overflow-hidden bg-zinc-950/40">
            <div class="p-4 bg-slate-900/60 border-b border-white/5">
              <h4 class="font-bold text-xs uppercase tracking-wide text-zinc-300">Earnings cycle leverage simulation</h4>
            </div>
            <div class="p-4 space-y-3 text-xs">
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-zinc-500">Base Cycle Pairing Value:</span>
                <span class="font-mono text-zinc-200">{{ currencySymbol }}{{ formatNumber(currentPrice?.matchBonus) }}</span>
              </div>
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-zinc-500">Heads Multiplier:</span>
                <span class="font-mono text-amber-500 font-bold">×{{ headsCount }}</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-zinc-200 font-bold">Potential Cycle Earnings:</span>
                <span class="font-mono text-amber-400 font-black text-sm">
                  {{ currencySymbol }}{{ formatNumber(potentialCycleEarnings) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Products included -->
        <div class="space-y-6">
          <h3 class="text-lg font-display font-extrabold text-white flex items-center gap-2">
            <span>📦</span> High-Value Product Assortment Included
          </h3>
          <p class="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Every entry level package comes with a physical assortment of world-class food supplements, daily essentials, and longevity beverages matching or exceeding the investment amount.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="product in catalogStore.products" 
              :key="product.id"
              class="p-4 bg-slate-900/30 border border-white/5 hover:border-amber-500/20 rounded-xl flex items-center gap-3 transition"
            >
              <div class="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-zinc-200 shrink-0">
                <img v-if="product.image" :src="getFullMediaUrl(product.image)" :alt="product.name" class="w-full h-full object-contain" />
                <span v-else class="text-slate-800 font-bold text-[10px]">{{ product.name.substring(0,2) }}</span>
              </div>
              <div>
                <h4 class="font-bold text-xs text-white">{{ product.name }}</h4>
                <p class="text-[10px] text-zinc-500 truncate max-w-[180px]">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit order Call to Action -->
        <div class="nma-card p-6 sm:p-8 text-center space-y-6 border-amber-500/30 bg-gradient-to-br from-indigo-950/20 to-amber-500/5">
          <h3 class="font-display font-extrabold text-xl text-amber-400">Ready to secure your position?</h3>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Secure your slot positioning in the binary tree by sending an enrollment request to your active trainer.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <UiButton variant="primary" @click="consultTrainer">
              Submit WhatsApp Order Request
            </UiButton>
            <UiButton variant="outline" @click="goBack">
              Cancel & Return
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
import api, { getFullMediaUrl } from '../api';

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

const pkg = computed(() => {
  return catalogStore.packages.find((p) => p.slug === route.params.slug);
});

const currentPrice = computed(() => {
  if (!pkg.value) return null;
  return pkg.value.prices?.find((p) => p.countryCode === selectedCountryCode.value);
});

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
  // Save Slide 7 to restore state on returning
  sessionStorage.setItem('presentation_slide', '7');
  router.push('/presentation');
};

const consultTrainer = () => {
  if (!pkg.value || !currentPrice.value) return;
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  const text = encodeURIComponent(`Hello Trainer, I am ready to enroll with the ${pkg.value.name} (${currencySymbol.value}${formatNumber(currentPrice.value.price)}) in ${selectedCountryName.value}. Please guide me on structural positioning.`);
  window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
};
</script>

<style scoped>
select option {
  background-color: #0b1329;
  color: #fff;
}
.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
