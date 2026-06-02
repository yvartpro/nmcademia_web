<template>
  <div class="min-h-screen bg-surface-0 dark:bg-surface-0-dark pb-28 nma-gradient-mesh">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/90 dark:bg-surface-1-dark/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <AppLogo size="sm" />
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <div class="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-1.5">
            <Globe :size="14" class="text-zinc-400" />
            <select
              v-model="selectedCountryCode"
              @change="changeCountry"
              class="bg-transparent text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.code }} ({{ c.currencySymbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 pb-3">
        <UiProgress :current="currentSlide" :total="totalSlides" :show-label="false" />
      </div>
    </header>

    <!-- Journey context for registered learners -->
    <div
      v-if="memberStore.isRegistered"
      class="max-w-3xl mx-auto px-4 sm:px-6 pt-4"
    >
      <div class="nma-card px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-accent/20">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-accent">Your path</p>
          <p class="text-sm font-medium">{{ memberStore.journey.title }}</p>
          <p class="text-xs text-zinc-500">{{ memberStore.journey.welcomeLine }}</p>
        </div>
        <UiButton
          v-if="memberStore.canFeature('courses')"
          variant="outline"
          size="sm"
          to="/app/training"
          class="shrink-0"
        >
          Training
        </UiButton>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <!-- Slide 1 -->
      <div v-if="currentSlide === 1" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Partner Company</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">
          {{ settings['partner_company_name'] || 'Alliance In Motion Global Group of Companies' }}
        </h2>
        <div class="nma-card p-6">
          <p class="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
            {{ settings['partner_company_intro'] }}
          </p>
        </div>
      </div>

      <!-- Slide 2 -->
      <div v-if="currentSlide === 2" class="motion-safe:animate-fade-in space-y-8">
        <div class="space-y-4">
          <UiSectionLabel>Company Profile</UiSectionLabel>
          <h2 class="text-2xl md:text-3xl font-display font-bold">About Alliance In Motion Global</h2>
          <p class="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line nma-card p-6">
            {{ settings['partner_company_profile'] }}
          </p>
        </div>
        <div class="space-y-4">
          <h3 class="text-lg font-display font-semibold">Visionary Founders</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="founder in founders" :key="founder.id" class="nma-card p-4 flex flex-col gap-3">
              <div class="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="founder.photo" :src="getFullMediaUrl(founder.photo)" :alt="founder.name" class="w-full h-full object-cover" />
                <span v-else class="text-zinc-500 font-bold">{{ founder.initials || founder.name.split(' ').map(n=>n[0]).join('') }}</span>
              </div>
              <div>
                <h4 class="font-bold text-sm">{{ founder.name }}</h4>
                <p class="text-xs text-accent font-medium">{{ founder.role }}</p>
              </div>
              <p class="text-xs text-zinc-500 leading-relaxed">{{ founder.bio }}</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h3 class="text-lg font-display font-semibold">Manufacturing Partners</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="partner in partners" :key="partner.id" class="nma-card p-4 flex flex-col items-center text-center">
              <div class="w-16 h-16 mb-2">
                <img v-if="partner.logo" :src="getFullMediaUrl(partner.logo)" :alt="partner.name" class="w-full h-full object-contain opacity-70" />
                <div v-else class="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-400">{{ partner.name }}</div>
              </div>
              <h5 class="font-bold text-sm">{{ partner.name }}</h5>
              <p class="text-xs text-zinc-500">{{ partner.country }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3 -->
      <div v-if="currentSlide === 3" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Our Products</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">World-Class Health & Wellness</h2>
        <div class="aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow">
          <iframe
            v-if="settings['video_url']"
            :src="settings['video_url']"
            title="Presentation Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
            <Play :size="32" class="mb-2 opacity-50" />
            Video presentation goes here
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="product in catalogStore.products" :key="product.id" class="nma-card p-4 flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2">
              <img v-if="product.image" :src="getFullMediaUrl(product.image)" :alt="product.name" class="w-full h-full object-contain" />
            </div>
            <h4 class="font-bold text-sm">{{ product.name }}</h4>
            <p class="text-xs text-zinc-500 line-clamp-2 mt-1">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- Slide 4 -->
      <div v-if="currentSlide === 4" class="motion-safe:animate-fade-in space-y-8">
        <div class="space-y-4">
          <UiSectionLabel>Aspirations</UiSectionLabel>
          <h2 class="text-2xl md:text-3xl font-display font-bold">What is Your Dream?</h2>
          <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 nma-card p-6">{{ settings['dream_section_text'] }}</p>
        </div>
        <div class="space-y-4">
          <h3 class="text-lg font-display font-semibold">Success Stories</h3>
          <div class="flex gap-4 overflow-x-auto pb-2 nma-scrollbar -mx-1 px-1">
            <div
              v-for="test in testimonials"
              :key="test.id"
              class="shrink-0 w-72 nma-card p-5 flex flex-col gap-3"
            >
              <div class="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img v-if="test.photo" :src="getFullMediaUrl(test.photo)" :alt="test.name" class="w-full h-full object-cover" />
              </div>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 italic flex-1">"{{ test.quote }}"</p>
              <div>
                <h4 class="font-bold text-sm">{{ test.name }}</h4>
                <span v-if="test.lifestyleTag" class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{{ test.lifestyleTag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 5: Interactive Quadrant -->
      <div v-if="currentSlide === 5" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Financial Education</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">The Cashflow Quadrant</h2>
        <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{{ settings['cashflow_quadrant_explanation'] }}</p>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(q, key) in quadrantData"
            :key="key"
            type="button"
            @click="activeQuadrant = key"
            class="nma-card p-4 text-center space-y-2 transition-all duration-200 border-t-4"
            :class="[
              quadrantColors[key].border,
              activeQuadrant === key ? 'ring-2 ring-accent shadow-glow scale-[1.02]' : 'hover:scale-[1.01]',
            ]"
          >
            <div class="text-2xl font-black">{{ key }}</div>
            <h4 class="font-bold text-xs uppercase text-zinc-500">{{ q.title.split(' - ')[1] || q.title.split(' ').slice(1).join(' ') }}</h4>
          </button>
        </div>

        <div v-if="activeQuadrantInfo" class="nma-card p-5 border-accent/30 motion-safe:animate-fade-in">
          <h4 class="font-display font-bold text-lg mb-2">{{ activeQuadrantInfo.title }}</h4>
          <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{{ activeQuadrantInfo.description }}</p>
          <p class="text-xs font-medium text-accent">
            <span class="text-zinc-500">Leverage:</span> {{ activeQuadrantInfo.leverage }}
          </p>
          <p v-if="activeQuadrant === 'B'" class="mt-3 text-sm font-semibold nma-gradient-text">
            Network Marketing = B Quadrant
          </p>
        </div>
      </div>

      <!-- Slide 6 -->
      <div v-if="currentSlide === 6" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Compensation Plan</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">Ways of Earning</h2>
        <div class="space-y-3">
          <div v-for="(stream, idx) in earningStreams" :key="stream.id" class="nma-card p-5 flex gap-4">
            <div class="text-2xl mt-0.5">{{ stream.icon || '💰' }}</div>
            <div>
              <h4 class="font-bold text-sm">{{ idx + 1 }}. {{ stream.title }}</h4>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{{ stream.shortDescription }}</p>
              <p v-if="stream.longDescription" class="text-xs text-zinc-500 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-2">{{ stream.longDescription }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 7 -->
      <div v-if="currentSlide === 7" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Registration</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">How To Join ({{ selectedCountryCode }})</h2>
        <p class="text-sm text-zinc-500">Select a registration package to start your journey.</p>
        <p v-if="settings['how_to_join_note']" class="text-xs leading-relaxed text-zinc-500 nma-card p-4 whitespace-pre-line">{{ settings['how_to_join_note'] }}</p>

        <div class="space-y-4">
          <div v-for="pkg in catalogStore.packages" :key="pkg.id" class="nma-card p-5 space-y-4">
            <div class="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 class="font-bold text-lg">{{ pkg.name }}</h3>
                <p class="text-xs text-zinc-500">Provides {{ pkg.points }} points</p>
              </div>
              <span class="font-black text-xl nma-gradient-text">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl">
                <span class="block text-zinc-500 mb-0.5">Referral Bonus</span>
                <strong>{{ currencySymbol }}{{ getPriceForCountry(pkg, 'referralBonus') }}</strong>
              </div>
              <div class="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl">
                <span class="block text-zinc-500 mb-0.5">Match Bonus</span>
                <strong>{{ currencySymbol }}{{ getPriceForCountry(pkg, 'matchBonus') }}</strong>
              </div>
            </div>
            <UiButton variant="secondary" full-width @click="consultTrainerPackage(pkg)">
              Register via WhatsApp
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Slide 8 -->
      <div v-if="currentSlide === 8" class="motion-safe:animate-fade-in space-y-6">
        <UiSectionLabel>Information</UiSectionLabel>
        <h2 class="text-2xl md:text-3xl font-display font-bold">Frequently Asked Questions</h2>
        <input v-model="searchQuery" type="search" placeholder="Search questions…" class="nma-input" />

        <div class="nma-card overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <div v-for="faq in filteredFAQsList" :key="faq.id">
            <button
              type="button"
              @click="toggleFAQ(faq.id)"
              class="w-full text-left p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span class="font-medium text-sm pr-4">{{ faq.question }}</span>
              <ChevronDown :size="16" class="text-zinc-400 shrink-0 transition-transform" :class="{ 'rotate-180': openFAQs.includes(faq.id) }" />
            </button>
            <div v-if="openFAQs.includes(faq.id)" class="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="nma-card p-6 text-center space-y-4 border-accent/30 bg-accent-muted/20 dark:bg-accent/5">
          <h3 class="font-display font-bold text-lg">
            {{ finishTitle }}
          </h3>
          <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ finishMessage }}</p>
          <div v-if="memberStore.isRegistered && memberStore.canFeature('ownerMentor')" class="text-left">
            <OwnerMentorCard cta-label="Speak with Your Coach" />
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <UiButton variant="primary" @click="consultTrainerPackage({ name: 'General Entry' })">
              Contact Coach on WhatsApp
            </UiButton>
            <UiButton
              v-if="memberStore.canFeature('courses')"
              variant="outline"
              to="/app/training"
            >
              Continue to Training →
            </UiButton>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom nav -->
    <div class="fixed bottom-0 left-0 right-0 border-t border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/95 dark:bg-surface-1-dark/95 backdrop-blur-xl p-4 z-50 nma-safe-bottom">
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <UiButton variant="ghost" size="sm" :disabled="currentSlide === 1" @click="prevSlide">Previous</UiButton>
        <span class="text-xs text-zinc-500 font-mono font-medium">{{ currentSlide }} / {{ totalSlides }}</span>
        <UiButton variant="primary" size="sm" :disabled="currentSlide === totalSlides" @click="nextSlide">
          {{ currentSlide === totalSlides ? 'Finish' : 'Next' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Globe, Play, ChevronDown } from 'lucide-vue-next';
import AppLogo from '../components/ui/AppLogo.vue';
import ThemeToggle from '../components/ui/ThemeToggle.vue';
import UiSectionLabel from '../components/ui/UiSectionLabel.vue';
import UiProgress from '../components/ui/UiProgress.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useContentStore } from '../stores/content';
import { useMemberStore } from '../stores/member';
import OwnerMentorCard from '../components/journey/OwnerMentorCard.vue';
import api, { getFullMediaUrl } from '../api';

const memberStore = useMemberStore();

const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const contentStore = useContentStore();

const currentSlide = ref(1);
const totalSlides = 8;

const nextSlide = () => {
  if (currentSlide.value < totalSlides) currentSlide.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const prevSlide = () => {
  if (currentSlide.value > 1) currentSlide.value--;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');
const activeQuadrant = ref('B');
const openFAQs = ref([]);
const searchQuery = ref('');
const rawFAQs = ref([]);

const quadrantColors = {
  E: { border: 'border-t-red-500' },
  S: { border: 'border-t-orange-500' },
  B: { border: 'border-t-brand' },
  I: { border: 'border-t-success' },
};

const quadrantData = {
  E: {
    title: 'E - Employee',
    description: 'You trade your time directly for a salary. You work for a system that controls your time, earnings, and advancement. If you stop working, your income instantly drops to zero.',
    leverage: 'Zero leverage. Your income is 100% dependent on your personal hourly presence.',
  },
  S: {
    title: 'S - Self-Employed / Specialist',
    description: 'You own your job, but you are still the primary system. If you take a vacation, the business closes.',
    leverage: 'Very low leverage. You cannot duplicate yourself easily without expanding overhead dramatically.',
  },
  B: {
    title: 'B - Business Owner',
    description: 'You own a system and lead people. You create a network where other people\'s efforts produce revenue for the ecosystem.',
    leverage: 'Maximum leverage. Network marketing is the most accessible vehicle to cross into the B quadrant without huge capital.',
  },
  I: {
    title: 'I - Investor',
    description: 'Your money works for you. You invest resources into assets that yield passive returns.',
    leverage: 'Capital leverage. Money works as your duplicate employee.',
  },
};

const activeQuadrantInfo = computed(() => quadrantData[activeQuadrant.value]);

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    catalogStore.fetchPackages(),
    catalogStore.fetchProducts(),
    settingsStore.fetchSettings(),
    contentStore.fetchAll(),
    fetchFAQs(),
  ]);
  if (catalogStore.countries.length > 0 && !catalogStore.countries.some((c) => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }
});

const selectedCountryName = computed(() => catalogStore.selectedCountry?.name || 'Your Country');
const currencySymbol = computed(() => catalogStore.selectedCountry?.currencySymbol || '₦');

const conversionRate = computed(() => {
  const code = selectedCountryCode.value;
  if (code === 'KE') return 0.1;
  if (code === 'BI') return 2.0;
  if (code === 'US') return 0.00075;
  return 1.0;
});

const testimonials = computed(() => contentStore.testimonials);
const founders = computed(() => contentStore.founders);
const partners = computed(() => contentStore.manufacturingPartners);
const earningStreams = computed(() => contentStore.earningStreams);
const settings = computed(() => settingsStore.settings);

const finishTitle = computed(() => {
  if (!memberStore.isRegistered) return 'Ready to begin?';
  if (memberStore.canFeature('courses')) return 'Presentation complete';
  return 'Thank you for reviewing the opportunity';
});

const finishMessage = computed(() => {
  if (!memberStore.isRegistered) {
    return 'Your coach is waiting to guide you through the next steps.';
  }
  if (memberStore.canFeature('courses')) {
    return 'When you are ready, continue to your personalized training track.';
  }
  return 'Your path is focused on this presentation. Reach out to your coach with any questions.';
});

const changeCountry = () => {
  catalogStore.selectCountry(selectedCountryCode.value);
};

const getPriceForCountry = (pkg, field) => {
  const priceObj = pkg.prices?.find((p) => p.countryCode === selectedCountryCode.value);
  if (priceObj) return formatNumber(priceObj[field]);
  const base = pkg[field] || 0;
  return formatNumber(base * conversionRate.value);
};

const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const consultTrainerPackage = (pkg) => {
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  const text = encodeURIComponent(`Hello Trainer, I am interested in registering for the ${pkg.name} (${currencySymbol.value}${getPriceForCountry(pkg, 'price')}) in ${selectedCountryName.value}. Please guide me on registration.`);
  window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
};

const fetchFAQs = async () => {
  try {
    const response = await api.get('/faqs');
    rawFAQs.value = response.data;
  } catch (err) {
    console.error('Fetch FAQs failed:', err);
  }
};

const filteredFAQsList = computed(() => {
  if (!searchQuery.value) return rawFAQs.value;
  const q = searchQuery.value.toLowerCase();
  return rawFAQs.value.filter((f) =>
    f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});

const toggleFAQ = (id) => {
  const index = openFAQs.value.indexOf(id);
  if (index === -1) openFAQs.value.push(id);
  else openFAQs.value.splice(index, 1);
};
</script>

<style scoped>
select option {
  background-color: #fff;
  color: #000;
}
.dark select option {
  background-color: #18181b;
  color: #fff;
}
</style>
