<template>
  <div class="min-h-screen bg-surface-0 text-zinc-900 nma-gradient-mesh font-sans relative overflow-x-hidden">
    
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <AppLogo size="sm" />
        <div class="flex items-center gap-4">
            <router-link v-if="memberStore.isRegistered && countryHasOffice" :to="memberStore.journey?.defaultRoute || '/presentation'" class="hidden sm:inline-flex bg-accent hover:bg-accent-dark text-slate-50 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition shadow-md">
            {{ $t('landing.nav.continuePresentation') }}
          </router-link>
          <a v-else-if="memberStore.isRegistered && !countryHasOffice && whatsappJoinLink !== '#'" :href="whatsappJoinLink" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition shadow-md">
            {{ $t('landing.nav.joinWhatsApp') }}
          </a>
          <a v-else href="#journeys" class="hidden sm:inline-flex bg-accent hover:bg-accent-dark text-slate-50 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition shadow-md">
            {{ $t('landing.nav.startJourney') }}
          </a>
          <select v-model="headerSelected" @change="onLangChange" :disabled="languagesStore.loading || !headerLanguages.length" class="text-xs bg-white border border-accent/20 text-accent rounded-md px-3 py-1 shadow-sm hover:shadow-md transition-shadow duration-150 appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent-dark">
              <option v-if="!headerLanguages.length" disabled value="">{{ languagesStore.loading ? $t('landing.nav.loadingLanguages') : $t('landing.nav.noLanguages') }}</option>
              <option v-for="l in headerLanguages" :key="l.id" :value="l.id">{{ l.name }}</option>
            </select>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8 relative">
      <!-- Background glow -->
      <div class="absolute inset-0 -z-10 flex items-center justify-center">
        <div class="w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div class="space-y-4 max-w-4xl mx-auto">
        <h1 class="text-2xl sm:text-5xl font-display font-extrabold tracking-tight leading-[1.1] text-zinc-950 text-justify">
          {{ $t('landing.hero.title') }}
          <span class="text-accent">{{ $t('landing.hero.titleAccent') }}</span>
        </h1>
        <p class="text-base sm:text-xl text-zinc-550 max-w-3xl mx-auto leading-relaxed pt-2 text-justify">
          {{ $t('landing.hero.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div class="w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 shrink-0 relative">
          <div class="absolute inset-0 bg-accent rounded-full opacity-20 blur-2xl"></div>
          <img 
            :src="ownerStore.photoUrl" 
            :alt="ownerStore.name" 
            class="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10"
          />
        </div>
        <div class="w-full max-w-xl rounded-xl border border-zinc-200 bg-white/70 p-5 text-left lg:text-left">
          <h2 class="text-xl sm:text-2xl font-semibold text-zinc-950">{{ ownerStore.name }}</h2>
          <p class="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed whitespace-pre-wrap text-justify">{{ ownerStore.bio }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link v-if="memberStore.isRegistered && countryHasOffice" :to="memberStore.journey?.defaultRoute || '/presentation'" class="w-full sm:w-auto text-white bg-gradient-to-r from-accent to-accent-dark hover:text-zinc-900 hover:from-accent-light hover:to-accent text-slate-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all shadow-glow hover:scale-[1.02] text-center">
          {{ $t('landing.nav.continuePresentation') }}
        </router-link>
        <a v-else-if="memberStore.isRegistered && !countryHasOffice && whatsappJoinLink !== '#'" :href="whatsappJoinLink" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all shadow-glow hover:scale-[1.02] text-center">
          {{ $t('landing.nav.joinWhatsApp') }}
        </a>
        <a v-else href="#journeys" class="w-full sm:w-auto text-white bg-gradient-to-r from-accent to-accent-dark hover:text-zinc-900 hover:from-accent-light hover:to-accent text-slate-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all shadow-glow hover:scale-[1.02] text-center">
          {{ $t('landing.nav.startJourney') }}
        </a>
        <a href="#why-nm" class="w-full sm:w-auto bg-white/5 border border-zinc-350 hover:bg-white/10 text-zinc-900 font-bold px-8 py-4 rounded-xl text-sm transition text-center">
          {{ $t('landing.nav.watchIntroduction') }}
        </a>
      </div>
    </header>

    <!-- Social Proof Section -->
    <section class="border-y border-zinc-200/80 bg-zinc-50/50 py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="stat in proofStats" :key="stat.label" class="text-center space-y-1">
            <p class="text-4xl sm:text-5xl font-display font-black text-accent">{{ stat.value }}</p>
            <p class="text-sm text-zinc-500 font-semibold uppercase tracking-wider">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl sm:text-4xl font-display font-black">{{ $t('landing.mission.title') }}</h2>
      </div>

      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-accent">{{ $t('landing.mission.powerTitle') }}</h3>
          <p class="text-zinc-650 leading-relaxed text-justify">
            {{ $t('landing.mission.powerText1') }}
          </p>
          <p class="text-zinc-650 leading-relaxed text-justify">
            {{ $t('landing.mission.powerText2') }}
          </p>
        </div>
        <div class="nma-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-indigo-950/20 to-accent/5">
          <h4 class="font-display font-extrabold text-lg">{{ $t('landing.mission.modernEconomyTitle') }}</h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-accent text-lg">✦</span>
              <p class="text-sm text-zinc-700"><strong>{{ $t('landing.mission.modernEconomy.leverageLabel') }}</strong> {{ $t('landing.mission.modernEconomy.leverageText') }}</p>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-accent text-lg">✦</span>
              <p class="text-sm text-zinc-700"><strong>{{ $t('landing.mission.modernEconomy.mobileLabel') }}</strong> {{ $t('landing.mission.modernEconomy.mobileText') }}</p>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-accent text-lg">✦</span>
              <p class="text-sm text-zinc-700"><strong>{{ $t('landing.mission.modernEconomy.pioneerLabel') }}</strong> {{ $t('landing.mission.modernEconomy.pioneerText') }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Why Network Marketing Section -->
    <section id="why-nm" class="border-t border-zinc-200/80 bg-zinc-50/50 py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center space-y-3">
          <h2 class="text-3xl sm:text-4xl font-display font-black">{{ $t('landing.why.title') }}</h2>
          <p class="text-sm text-zinc-500 max-w-xl mx-auto text-justify">{{ $t('landing.why.description') }}</p>
          <h3 class="text-xl font-bold text-accent">{{ $t('landing.why.howTitle') }}</h3>
          <p class="max-w-xl mx-auto text-justify">{{ $t('landing.why.howDescription') }}</p>
        </div>

        <div 
          @click="openVideo(settingsStore.settings['nm_video_url'], 'Eric Worre - What is Network Marketing', nmVideoThumbnail)"
          class="max-w-3xl mx-auto aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
        >
          <img
            v-if="nmVideoThumbnail"
            :src="getFullMediaUrl(nmVideoThumbnail)"
            alt="Video thumbnail"
            class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition duration-500"
          />
          <div v-else class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
          <div class="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
            <Play :size="36" class="text-white ml-2" />
          </div>
        </div>
      </div>
    </section>

    <!-- Funnel Journey Selection Section -->
    <section v-if="!memberStore.isRegistered" id="journeys" class="border-t border-zinc-200/80 bg-gradient-to-b from-transparent to-zinc-950/20 py-24 scroll-mt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center space-y-4">
          <h2 class="text-3xl sm:text-5xl font-display font-black">{{ $t('landing.journeySelection.title') }}</h2>
          <p class="text-zinc-600 max-w-xl mx-auto text-sm sm:text-base text-justify">
            {{ $t('landing.journeySelection.subtitle') }}
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="j in journeys"
            :key="j.title"
            :to="`/funnel/${j.id}`"
            class="nma-card p-6 hover:border-accent hover:shadow-glow flex flex-col justify-between transition-all duration-300 group"
          >
            <div class="space-y-4">
              <div v-if="j.imageUrl" class="w-12 h-12 overflow-hidden rounded-xl border border-zinc-200 bg-white/80 flex items-center justify-center shrink-0">
                <img :src="j.imageUrl" :alt="j.title" class="w-full h-full object-cover" />
              </div>
              <span v-else class="text-3xl block group-hover:scale-110 transition-transform duration-300">{{ j.icon }}</span>
              <h3 class="text-lg font-bold text-zinc-950 font-display group-hover:text-accent transition-colors">
                {{ j.title }}
              </h3>
              <p class="text-xs sm:text-sm text-zinc-550 leading-relaxed">
                {{ j.desc }}
              </p>
            </div>
            <div class="pt-6 flex justify-end">
              <span class="text-xs font-bold text-accent group-hover:translate-x-1.5 transition-transform duration-300">
                {{ j.ctaLabel }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-200/80 bg-surface-1 py-8 px-4 text-center">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>{{ $t('landing.footer.copyright') }}</p>
        <p>{{ $t('landing.footer.partner') }}</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOwnerStore } from '../stores/owner';
import { useSettingsStore } from '../stores/settings';
import { useVideoPlayerStore } from '../stores/videoPlayer';
import { useMemberStore } from '../stores/member';
import { useCatalogStore } from '../stores/catalog';
import AppLogo from '../components/ui/AppLogo.vue';
import { useLanguagesStore } from '../stores/languages';
import { useContentStore } from '../stores/content';
import { Play } from 'lucide-vue-next';
import { getFullMediaUrl } from '../api';
import { useTranslationsStore } from '../stores/translations';

const memberStore = useMemberStore();
const ownerStore = useOwnerStore();
const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();
const languagesStore = useLanguagesStore();
const contentStore = useContentStore();
const translationsStore = useTranslationsStore();
const headerLanguages = ref([]);
const headerSelected = ref(null);
const videoStore = useVideoPlayerStore();

onMounted(async () => {
  if (catalogStore.countries.length === 0) {
    await catalogStore.fetchCountries();
  }
  await settingsStore.fetchSettings();
  // Load languages for the landing header and initialize select
  try {
    const langs = await languagesStore.fetchLanguages();
    console.log('LandingPage loaded languages:', langs);
    headerLanguages.value = langs;
    headerSelected.value = languagesStore.selectedLanguageId;
  } catch (err) {
    console.error('Failed loading languages on landing:', err);
  }
});

const onLangChange = async () => {
  languagesStore.setSelectedLanguage(headerSelected.value);
  try {
    await Promise.all([
      contentStore.fetchAll(),
      catalogStore.fetchProducts(),
      catalogStore.fetchPackages(),
      settingsStore.fetchSettings(),
      ownerStore.fetchProfile()
    ]);
  } catch (err) {
    window.location.reload();
  }
};

const openVideo = (src, title, thumbnail = null) => {
  videoStore.open({ src, title, thumbnail });
};

const selectedCountry = computed(() => {
  const code = memberStore.isRegistered ? memberStore.profile.country : catalogStore.selectedCountryCode;
  return catalogStore.countryByCode(code) || catalogStore.selectedCountry || null;
});

const countryHasOffice = computed(() => {
  return !selectedCountry.value || selectedCountry.value.hasOffice !== false;
});

const whatsappJoinLink = computed(() => {
  return ownerStore.whatsappGroupLink || '#';
});

const nmVideoThumbnail = computed(() => {
  return settingsStore.settings['nm_video_url_thumbnail'] || settingsStore.settings['nm_video_thumbnail'] || null;
});

const parseJourneySettings = () => {
  const raw = settingsStore.settings?.landing_journeys;

  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const journeys = computed(() => {
  const configured = parseJourneySettings();
  if (configured.length > 0) {
    return configured.map((journey) => ({
      ...journey,
      imageUrl: journey.image ? getFullMediaUrl(journey.image) : ''
    }));
  }

  return [
    {
      id: 'new-to-nm',
      icon: '🌱',
      title: translationsStore.t('landing.journeys.newToNm.title'),
      desc: translationsStore.t('landing.journeys.newToNm.desc'),
      ctaLabel: translationsStore.t('landing.journeys.newToNm.ctaLabel'),
      image: ''
    },
    {
      id: 'already-in-nm',
      icon: '📈',
      title: translationsStore.t('landing.journeys.alreadyInNm.title'),
      desc: translationsStore.t('landing.journeys.alreadyInNm.desc'),
      ctaLabel: translationsStore.t('landing.journeys.alreadyInNm.ctaLabel'),
      image: ''
    },
    {
      id: 'switch-companies',
      icon: '🔄',
      title: translationsStore.t('landing.journeys.switchCompanies.title'),
      desc: translationsStore.t('landing.journeys.switchCompanies.desc'),
      ctaLabel: translationsStore.t('landing.journeys.switchCompanies.ctaLabel'),
      image: ''
    },
    {
      id: 'exploring',
      icon: '🔍',
      title: translationsStore.t('landing.journeys.exploring.title'),
      desc: translationsStore.t('landing.journeys.exploring.desc'),
      ctaLabel: translationsStore.t('landing.journeys.exploring.ctaLabel'),
      image: ''
    },
    {
      id: 'income-diversification',
      icon: '💰',
      title: translationsStore.t('landing.journeys.incomeDiversification.title'),
      desc: translationsStore.t('landing.journeys.incomeDiversification.desc'),
      ctaLabel: translationsStore.t('landing.journeys.incomeDiversification.ctaLabel'),
      image: ''
    },
    {
      id: 'jobless',
      icon: '🎯',
      title: translationsStore.t('landing.journeys.jobless.title'),
      desc: translationsStore.t('landing.journeys.jobless.desc'),
      ctaLabel: translationsStore.t('landing.journeys.jobless.ctaLabel'),
      image: ''
    },
    {
      id: 'fast-track',
      icon: '🔥',
      title: translationsStore.t('landing.journeys.fastTrack.title'),
      desc: translationsStore.t('landing.journeys.fastTrack.desc'),
      ctaLabel: translationsStore.t('landing.journeys.fastTrack.ctaLabel'),
      image: ''
    }
  ];
});

const proofStats = [
  { value: '50,000+', label: translationsStore.t('landing.proofStats.activeLearners') },
  { value: '40+', label: translationsStore.t('landing.proofStats.countriesRepresented') },
  { value: '25,000+', label: translationsStore.t('landing.proofStats.successStories') },
];

const testimonials = [
  {
    name: 'David Kamara',
    quote: 'Before I joined this business, I was working long hours every day and still struggling financially. At first, I doubted network marketing because many people around me didn\'t understand it. But after staying consistent, learning new skills, and building my team step by step, everything started changing. Today, I earn more than I ever imagined.',
    tag: 'African Professional',
  },
  {
    name: 'Jessica Miller',
    quote: 'I used to feel trapped in the corporate routine — waking up early, commuting every day, and living paycheck to paycheck despite having a good job. What attracted me to this opportunity was the flexibility and the possibility of building something for myself. Now I work from anywhere and spend more time with my children.',
    tag: 'Western Lifestyle',
  },
  {
    name: 'Sarah Johnson',
    quote: 'As a single mother, life was extremely difficult. I tried small businesses and side hustles, but nothing gave me stability. When a friend introduced me to network marketing, I decided to give myself one more chance. Slowly, I started seeing results. The extra income helped me pay school fees and improve my home.',
    tag: 'Single Mother',
  },
];

</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
.shadow-glow {
  box-shadow: 0 0 50px -10px rgba(212, 175, 55, 0.25);
}
.animate-slide-up {
  animation: slideUp 0.4s ease-out forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
