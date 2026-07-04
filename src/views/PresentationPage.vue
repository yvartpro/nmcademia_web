<template>
  <div class="min-h-screen bg-surface-0 pb-28 nma-gradient-mesh font-sans">

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <AppLogo size="sm" />
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-zinc-200">
            <CountrySelect
              v-model="selectedCountryCode"
              compact
              show-currency
              :full-width="false"
              @change="changeCountry"
            />
          </div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 pb-3">
        <UiProgress :current="currentSlide" :total="totalSlides" :show-label="false" />
      </div>
    </header>

    <!-- Post-signup journey welcome -->
    <div v-if="memberStore.isRegistered" class="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
      <div v-if="showPostSignupWelcome" class="p-4 bg-accent/10 border border-accent/20 rounded-xl">
        <p class="text-sm font-semibold text-zinc-900">
          Welcome back, leader. Review this business overview, and transition to your training curriculum when ready.
        </p>
      </div>
      <div class="nma-card-glass p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 class="text-sm font-extrabold text-zinc-900 mt-0.5">{{ memberStore.journey.title }}</h4>
          <p class="text-xs text-zinc-500 mt-1">{{ memberStore.journey.welcomeLine }}</p>
        </div>
        <!-- <UiButton v-if="memberStore.canFeature('courses')" variant="outline" size="sm" to="/app/training" class="shrink-0">
          Go to Training Curriculum
        </UiButton> -->
      </div>
    </div>

    <!-- Slide Viewport -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <CompanyProfile
        v-if="currentSlide === 1"
        :settings="settings"
      />
      <FoundersPartners
        v-else-if="currentSlide === 2"
        :settings="settings"
        :founders="founders"
        :partners="partners"
      />
      <ProductsCatalog
        v-else-if="currentSlide === 3"
        :settings="settings"
        :products="catalogStore.products"
        :presentation="presentation"
      />
      <DreamTestimonials
        v-else-if="currentSlide === 4"
        :settings="settings"
        :testimonials="testimonials"
      />
      <CashflowQuadrant
        v-else-if="currentSlide === 5"
        :settings="settings"
        v-model:activeQuadrant="activeQuadrant"
      />
      <PackageShowcase
        v-else-if="currentSlide === 6"
        :packages="catalogStore.packages"
        :selected-country-code="selectedCountryCode"
        :currency-symbol="currencySymbol"
        :get-price-for-country="getPriceForCountry"
      />
      <BinaryCompensation
        v-else-if="currentSlide === 7"
        :settings="settings"
        :presentation="presentation"
        :earning-streams="earningStreams"
        :packages="catalogStore.packages"
        :currency-symbol="currencySymbol"
        :selected-country-code="selectedCountryCode"
        :media-preview="mediaPreview"
        :get-price-for-country="getPriceForCountry"
        :format-number="formatNumber"
      />
      <BusinessPlanPresentation
        v-else-if="currentSlide === 8"
        :presentation="presentation"
        :settings="settings"
      />
      <EntryPackages
        v-else-if="currentSlide === 9"
        :packages="catalogStore.packages"
        :selected-country-code="selectedCountryCode"
        :currency-symbol="currencySymbol"
        :get-price-for-country="getPriceForCountry"
        @consult="consultTrainerPackage"
        @details="goToDetails"
      />
      <FAQsFinish
        v-else-if="currentSlide === 10"
        :faqs="rawFAQs"
        :finish-title="finishTitle"
        :finish-message="finishMessage"
        :show-owner-mentor="memberStore.isRegistered && memberStore.canFeature('ownerMentor')"
        :show-training-link="memberStore.canFeature('courses')"
        @consult="consultTrainerPackage"
      />
    </main>

    <!-- Navigation Footer -->
    <div class="fixed bottom-0 left-0 right-0 border-t border-zinc-200/80 bg-surface-1/95 backdrop-blur-xl p-4 z-50 nma-safe-bottom shadow-lg">
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <UiButton variant="ghost" size="sm" :disabled="currentSlide === 1" @click="prevSlide">Previous Slide</UiButton>
        <span class="text-xs text-zinc-500 font-mono font-bold">{{ currentSlide }} / {{ totalSlides }}</span>
        <UiButton variant="primary" size="sm" :disabled="currentSlide === totalSlides" @click="nextSlide">
          {{ currentSlide === totalSlides ? 'Done' : 'Next Slide →' }}
        </UiButton>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CountrySelect from '../components/ui/CountrySelect.vue';
import { JOURNEY_IDS } from '../data/learnerJourneys';

import AppLogo from '../components/ui/AppLogo.vue';
import UiProgress from '../components/ui/UiProgress.vue';
import UiButton from '../components/ui/UiButton.vue';

import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useContentStore } from '../stores/content';
import { useMemberStore } from '../stores/member';
import { useMediaStore } from '../stores/media';
import api, { getFullMediaUrl } from '../api';

// Slide components
import CompanyProfile from './slides/CompanyProfile.vue';
import FoundersPartners from './slides/FoundersPartners.vue';
import ProductsCatalog from './slides/ProductsCatalog.vue';
import DreamTestimonials from './slides/DreamTestimonials.vue';
import CashflowQuadrant from './slides/CashflowQuadrant.vue';
import PackageShowcase from './slides/PackageShowcase.vue';
import BinaryCompensation from './slides/BinaryCompensation.vue';
import BusinessPlanPresentation from './slides/BusinessPlanPresentation.vue';
import EntryPackages from './slides/EntryPackages.vue';
import FAQsFinish from './slides/FAQsFinish.vue';

// ── Stores ──────────────────────────────────────────────────────────────────
const router = useRouter();
const mediaStore = useMediaStore();
const memberStore = useMemberStore();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const contentStore = useContentStore();

const mediaPreview = (asset) => mediaStore.resolveUrl(asset);

// ── Slide state ──────────────────────────────────────────────────────────────
const currentSlide = ref(1);
const totalSlides = 10;
const showPostSignupWelcome = ref(false);
const activeQuadrant = ref('B');
const rawFAQs = ref([]);
const presentation = ref(null);

const nextSlide = () => {
  if (currentSlide.value < totalSlides) currentSlide.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const prevSlide = () => {
  if (currentSlide.value > 1) currentSlide.value--;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── Country / currency ───────────────────────────────────────────────────────
const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');

const currencySymbol = computed(() => catalogStore.selectedCountry?.currencySymbol || '₦');
const selectedCountryName = computed(() => catalogStore.selectedCountry?.name || 'Your Country');

const conversionRate = computed(() => {
  const code = selectedCountryCode.value;
  if (code === 'KE') return 0.1;
  if (code === 'BI') return 2.0;
  if (code === 'US') return 0.00075;
  return 1.0;
});

const changeCountry = async () => {
  catalogStore.selectCountry(selectedCountryCode.value);
  localStorage.setItem('selected_country', selectedCountryCode.value);
  await fetchPresentation();
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getPriceForCountry = (pkg, field) => {
  const priceObj = pkg.prices?.find(p => p.countryCode === selectedCountryCode.value);
  if (priceObj) return formatNumber(priceObj[field]);
  return formatNumber((pkg[field] || 0) * conversionRate.value);
};

const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const goToDetails = (slug) => {
  sessionStorage.setItem('presentation_slide', String(currentSlide.value));
  router.push(`/package-details/${slug}`);
};

const consultTrainerPackage = (pkg) => {
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  const text = encodeURIComponent(
    `Hello Trainer, I am reviewing the ${pkg.name} (${currencySymbol.value}${getPriceForCountry(pkg, 'price')}) in ${selectedCountryName.value}. Please guide me on binary slot positioning.`
  );
  window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
};

// ── Content aliases ──────────────────────────────────────────────────────────
const settings = computed(() => settingsStore.settings);
const testimonials = computed(() => contentStore.testimonials);
const founders = computed(() => contentStore.founders);
const partners = computed(() => contentStore.manufacturingPartners);
const earningStreams = computed(() => contentStore.earningStreams);

// ── Finish slide computed ────────────────────────────────────────────────────
const finishTitle = computed(() => {
  if (!memberStore.isRegistered) return 'Ready to start your academy enrollment?';
  if (memberStore.canFeature('courses')) return 'Overview Complete';
  return 'Thank you for reviewing the business model';
});

const finishMessage = computed(() => {
  if (!memberStore.isRegistered) return 'Speak to a trainer on WhatsApp to assist with packaging and pioneer positioning.';
  if (memberStore.canFeature('courses')) return 'Proceed directly to your personalized learning curriculum dashboard.';
  return 'Your assigned journey is set to this slide-overview. Direct any questions to your active coordinator.';
});

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  const cachedSlide = sessionStorage.getItem('presentation_slide');
  if (cachedSlide) {
    currentSlide.value = parseInt(cachedSlide, 10);
    sessionStorage.removeItem('presentation_slide');
  }

  if (sessionStorage.getItem('nma_post_signup_journey') === JOURNEY_IDS.BUILD) {
    showPostSignupWelcome.value = true;
    sessionStorage.removeItem('nma_post_signup_journey');
  }

  await Promise.all([
    catalogStore.fetchCountries(),
    catalogStore.fetchPackages(),
    catalogStore.fetchProducts(),
    settingsStore.fetchSettings(),
    contentStore.fetchAll(),
    fetchFAQs(),
  ]);

  if (catalogStore.countries.length > 0 && !catalogStore.countries.some(c => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }

  await fetchPresentation();
});

const fetchPresentation = async () => {
  try {
    const response = await api.get(`/presentations/${selectedCountryCode.value}`);
    presentation.value = response.data;
  } catch (err) {
    console.error('Fetch presentation failed:', err);
    presentation.value = null;
  }
};

const fetchFAQs = async () => {
  try {
    const response = await api.get('/faqs');
    rawFAQs.value = response.data;
  } catch (err) {
    console.error('Fetch FAQs failed:', err);
  }
};
</script>

<style scoped>
select option {
  background-color: #fff;
  color: #000;
}
.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
