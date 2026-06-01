<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 pb-24">
    <!-- Header Navigation -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-sm">
            NMA
          </div>
          <div class="hidden sm:block">
            <h1 class="font-display font-semibold text-sm">Network Marketing Academia</h1>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button @click="themeStore.toggleTheme" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg v-if="themeStore.isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
            <select 
              v-model="selectedCountryCode" 
              @change="changeCountry"
              class="bg-transparent text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.code }} ({{ c.currencySymbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-1 pb-3">
        <div v-for="i in totalSlides" :key="i" class="h-1.5 flex-1 rounded-sm bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: i <= currentSlide ? '100%' : '0%' }"></div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      
      <!-- Slide 1: Welcome & Partner -->
      <div v-if="currentSlide === 1" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Partner Company</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
          {{ settings['partner_company_name'] || 'Alliance In Motion Global Group of Companies' }}
        </h2>
        <div class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-6 shadow-sm">
          <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {{ settings['partner_company_intro'] }}
          </p>
        </div>
      </div>

      <!-- Slide 2: Company Profile -->
      <div v-if="currentSlide === 2" class="animate-fade-in space-y-8">
        <div class="space-y-4">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Company Profile</span>
          <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">About Alliance In Motion Global</h2>
          <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-6 shadow-sm">
            {{ settings['partner_company_profile'] }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Visionary Founders</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="founder in founders" :key="founder.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 rounded flex flex-col gap-3 shadow-sm">
              <div class="w-12 h-12 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="founder.photo" :src="getFullMediaUrl(founder.photo)" :alt="founder.name" class="w-full h-full object-cover" />
                <span v-else class="text-gray-500 font-bold">{{ founder.initials || founder.name.split(' ').map(n=>n[0]).join('') }}</span>
              </div>
              <div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white">{{ founder.name }}</h4>
                <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">{{ founder.role }}</p>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{{ founder.bio }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Manufacturing Partners</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="partner in partners" :key="partner.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 rounded flex flex-col items-center text-center shadow-sm">
              <div class="w-16 h-16 mb-2">
                <img v-if="partner.logo" :src="getFullMediaUrl(partner.logo)" :alt="partner.name" class="w-full h-full object-contain grayscale opacity-70" />
                <div v-else class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">{{ partner.name }}</div>
              </div>
              <h5 class="font-bold text-sm text-gray-900 dark:text-white">{{ partner.name }}</h5>
              <p class="text-xs text-gray-500">{{ partner.country }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3: Our Products -->
      <div v-if="currentSlide === 3" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Our Products</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">World-Class Health & Wellness</h2>
        
        <div class="aspect-video bg-black rounded overflow-hidden shadow-sm relative">
          <iframe 
            v-if="settings['video_url']"
            :src="settings['video_url']" 
            title="Presentation Video"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="w-full h-full"
          ></iframe>
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm">
            <span class="text-2xl mb-2">▶</span>
            Video presentation goes here
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="product in catalogStore.products" :key="product.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-4 flex flex-col items-center text-center shadow-sm">
            <div class="w-20 h-20 mb-3 bg-gray-50 dark:bg-gray-800 rounded-sm p-2">
               <img v-if="product.image" :src="getFullMediaUrl(product.image)" :alt="product.name" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            </div>
            <h4 class="font-bold text-sm text-gray-900 dark:text-white">{{ product.name }}</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- Slide 4: Dream & Testimonials -->
      <div v-if="currentSlide === 4" class="animate-fade-in space-y-8">
        <div class="space-y-4">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Aspirations</span>
          <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">What is Your Dream?</h2>
          <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-6 shadow-sm">
            {{ settings['dream_section_text'] }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Success Stories</h3>
          <div class="space-y-4">
            <div v-for="test in testimonials" :key="test.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-5 rounded shadow-sm flex flex-col sm:flex-row gap-4">
              <div class="w-16 h-16 rounded bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
                <img v-if="test.photo" :src="getFullMediaUrl(test.photo)" :alt="test.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">"{{ test.quote }}"</p>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white">{{ test.name }}</h4>
                <div class="flex gap-2 mt-1 flex-wrap">
                  <span v-if="test.lifestyleTag" class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{{ test.lifestyleTag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 5: Cashflow Quadrant -->
      <div v-if="currentSlide === 5" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Financial Education</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">The Cashflow Quadrant</h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{{ settings['cashflow_quadrant_explanation'] }}</p>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <div class="bg-white dark:bg-[#1a1a1a] border-t-4 border-t-red-500 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm text-center space-y-2">
            <div class="text-2xl font-black text-gray-900 dark:text-white">E</div>
            <h4 class="font-bold text-xs uppercase text-gray-500">Employee</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">You have a job. You trade time for money.</p>
          </div>
          <div class="bg-white dark:bg-[#1a1a1a] border-t-4 border-t-orange-500 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm text-center space-y-2">
            <div class="text-2xl font-black text-gray-900 dark:text-white">S</div>
            <h4 class="font-bold text-xs uppercase text-gray-500">Self-Employed</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">You own a job. Money stops when you stop.</p>
          </div>
          <div class="bg-white dark:bg-[#1a1a1a] border-t-4 border-t-blue-500 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm text-center space-y-2">
            <div class="text-2xl font-black text-gray-900 dark:text-white">B</div>
            <h4 class="font-bold text-xs uppercase text-gray-500">Business Owner</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">You own a system. People work for you.</p>
          </div>
          <div class="bg-white dark:bg-[#1a1a1a] border-t-4 border-t-green-500 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm text-center space-y-2">
            <div class="text-2xl font-black text-gray-900 dark:text-white">I</div>
            <h4 class="font-bold text-xs uppercase text-gray-500">Investor</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">You own investments. Money works for you.</p>
          </div>
        </div>
      </div>

      <!-- Slide 6: Ways of Earning -->
      <div v-if="currentSlide === 6" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Compensation Plan</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">Ways of Earning</h2>
        
        <div class="space-y-4">
          <div v-for="(stream, idx) in earningStreams" :key="stream.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-5 rounded shadow-sm flex gap-4">
            <div class="text-2xl mt-1">{{ stream.icon || '💰' }}</div>
            <div>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                {{ idx + 1 }}. {{ stream.title }}
              </h4>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ stream.shortDescription }}</p>
              <p v-if="stream.longDescription" class="text-xs text-gray-500 mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">{{ stream.longDescription }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 7: How to Join -->
      <div v-if="currentSlide === 7" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Registration</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">How To Join ({{ selectedCountryCode }})</h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm">Select a registration package to start your journey.</p>
        
        <div class="space-y-4">
          <div v-for="pkg in nigeriaPackages" :key="pkg.id" class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-5 shadow-sm space-y-4">
            <div class="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ pkg.name }}</h3>
                <p class="text-xs text-gray-500">Provides {{ pkg.points }} points</p>
              </div>
              <div class="text-right">
                <span class="font-black text-xl text-blue-600 dark:text-blue-400">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span class="block text-gray-500 mb-0.5">Referral Bonus</span>
                <strong class="text-gray-900 dark:text-white">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'referralBonus') }}</strong>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span class="block text-gray-500 mb-0.5">Match Bonus</span>
                <strong class="text-gray-900 dark:text-white">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'matchBonus') }}</strong>
              </div>
            </div>
            <button @click="consultTrainerPackage(pkg)" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors text-sm">
              Register via WhatsApp
            </button>
          </div>
        </div>
      </div>

      <!-- Slide 8: FAQs & Next Steps -->
      <div v-if="currentSlide === 8" class="animate-fade-in space-y-6">
        <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Information</span>
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>

        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search questions…"
          class="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
        
        <div class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
          <div v-for="faq in filteredFAQsList" :key="faq.id" class="border-b border-gray-200 dark:border-gray-800 last:border-0">
            <button @click="toggleFAQ(faq.id)" class="w-full text-left p-4 flex items-center justify-between focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <span class="font-medium text-sm text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
              <span class="text-gray-400 transform transition-transform" :class="{ 'rotate-180': openFAQs.includes(faq.id) }">▼</span>
            </button>
            <div v-if="openFAQs.includes(faq.id)" class="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a]">
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-6 text-center space-y-4">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">Ready to begin?</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300">Your trainer is waiting to guide you through the next steps.</p>
          <button @click="consultTrainerPackage({name: 'General Entry'})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-colors text-sm w-full sm:w-auto">
            Contact Trainer on WhatsApp
          </button>
        </div>
      </div>

    </main>

    <!-- Bottom Navigation Bar -->
    <div class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none">
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <button 
          @click="prevSlide" 
          :disabled="currentSlide === 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="text-xs text-gray-500 font-medium tracking-widest">
          {{ currentSlide }} / {{ totalSlides }}
        </div>
        <button 
          @click="nextSlide" 
          :disabled="currentSlide === totalSlides"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {{ currentSlide === totalSlides ? 'Finish' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import { useThemeStore } from '../stores/theme';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useContentStore } from '../stores/content';
import api, { getFullMediaUrl } from '../api';

const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const themeStore = useThemeStore();

const currentSlide = ref(1);
const totalSlides = 8;

const nextSlide = () => { if (currentSlide.value < totalSlides) currentSlide.value++; window.scrollTo({ top: 0, behavior: 'smooth' }); };
const prevSlide = () => { if (currentSlide.value > 1) currentSlide.value--; window.scrollTo({ top: 0, behavior: 'smooth' }); };

const contentStore = useContentStore();

const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');
const activeQuadrant = ref('E');
const openFAQs = ref([]);
const searchQuery = ref('');
const rawFAQs = ref([]);

const quadrantData = {
  E: {
    title: 'E - Employee',
    description: 'You trade your time directly for a salary. You work for a system that controls your time, earnings, and advancement. If you stop working, your income instantly drops to zero.',
    leverage: 'Zero leverage. Your income is 100% dependent on your personal hourly presence.'
  },
  S: {
    title: 'S - Self-Employed / Specialist',
    description: 'You own your job, but you are still the primary system. If you take a vacation, the business closes. Doctors, lawyers, small shop owners, and consultants live here.',
    leverage: 'Very low leverage. You cannot duplicate yourself easily without expanding overhead dramatically.'
  },
  B: {
    title: 'B - Business Owner',
    description: 'You own a system and lead people. You create a network where other people\'s efforts, time, and skills produce revenue for the ecosystem. If you leave, the system continues running.',
    leverage: 'Maximum leverage. Network marketing is the most accessible vehicle to cross into the B quadrant without huge capital.'
  },
  I: {
    title: 'I - Investor',
    description: 'Your money works for you. You invest resources into assets, stocks, real estate, or network systems that yield passive returns.',
    leverage: 'Capital leverage. Money works as your duplicate employee.'
  }
};

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    catalogStore.fetchPackages(),
    catalogStore.fetchProducts(),
    settingsStore.fetchSettings(),
    contentStore.fetchAll(),
    fetchFAQs()
  ]);
  if (catalogStore.countries.length > 0 && !catalogStore.countries.some(c => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }
});

const selectedCountryName = computed(() => {
  return catalogStore.selectedCountry?.name || 'Your Country';
});

const currencySymbol = computed(() => {
  return catalogStore.selectedCountry?.currencySymbol || '₦';
});

const conversionRate = computed(() => {
  // Let's compute a simple conversion factor based on Nigeria currency baseline or simple scaling
  // NGN base is 1. If KES, convert (KES is about 7.5x smaller than NGN for packages? KES price 10000 vs NGN 99990, so factor 0.1)
  // Let's use the explicit package price from DB! For products price we can scale roughly:
  // NG: 1
  // KE: 0.1
  // BI: 2.0
  // US: 0.00075
  const code = selectedCountryCode.value;
  if (code === 'KE') return 0.1;
  if (code === 'BI') return 2.0;
  if (code === 'US') return 0.00075;
  return 1.0;
});

const whatsappLink = computed(() => {
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  return `https://wa.me/${number.replace(/\+/g, '')}`;
});

// Content store shortcuts
const testimonials = computed(() => contentStore.testimonials);
const founders = computed(() => contentStore.founders);
const manufacturingPartners = computed(() => contentStore.manufacturingPartners);
const partners = computed(() => contentStore.manufacturingPartners);
const earningStreams = computed(() => contentStore.earningStreams);

// Nigeria packages (for HOW TO JOIN section)
const nigeriaPackages = computed(() => {
  return catalogStore.packages.map(pkg => {
    const price = pkg.prices?.find(p => p.countryCode === 'NG');
    return price ? { ...pkg, ngPrice: price.price, ngReferralBonus: price.referralBonus, ngMatchBonus: price.matchBonus } : null;
  }).filter(Boolean);
});

// Settings shortcut
const settings = computed(() => settingsStore.settings);

const changeCountry = () => {
  catalogStore.selectCountry(selectedCountryCode.value);
};

const getPriceForCountry = (pkg, field) => {
  const priceObj = pkg.prices?.find(p => p.countryCode === selectedCountryCode.value);
  if (priceObj) {
    return formatNumber(priceObj[field]);
  }
  // Fallback scale based on selectedCountryCode
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

// FAQs loading & filtering
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
  return rawFAQs.value.filter(f => 
    f.question.toLowerCase().includes(q) || 
    f.answer.toLowerCase().includes(q)
  );
});

const toggleFAQ = (id) => {
  const index = openFAQs.value.indexOf(id);
  if (index === -1) {
    openFAQs.value.push(id);
  } else {
    openFAQs.value.splice(index, 1);
  }
};

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
select option {
  background-color: #fff;
  color: #000;
}
.dark select option {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
