<template>
  <div class="funnel-page min-h-screen bg-surface-0 flex flex-col justify-between nma-gradient-mesh font-sans pb-10">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <router-link to="/">
            <AppLogo size="sm" />
          </router-link>
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-xs text-zinc-500 hover:text-accent font-medium">{{ $t('funnel.header.exit') }}</router-link>
          </div>
        </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 pb-2">
        <div class="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-accent via-accent-light to-accent-dark transition-all duration-300 rounded-full"
            :style="{ width: `${(currentStepIndex / totalSteps) * 100}%` }"
          />
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="flex-grow flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-2xl nma-card-glass p-6 sm:p-10 motion-safe:animate-slide-up space-y-8">
        
        <!-- ================= PATH 1: NEWBIE (new-to-nm) ================= -->
        <div v-if="funnelId != 'already-in-nm'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 leading-tight">
              {{ $t('funnel.step1.title') }}
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650" v-html="$t('funnel.step1.intro').replace(/\n/g, '<br /><br />')"></p>
            <div 
              @click="playIntroVideo"
              class="aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
            >
              <img
                v-if="introVideoThumbnailUrl"
                :src="introVideoThumbnailUrl"
                alt="Video preview"
                class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition duration-500"
              />
              <div v-else class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
              <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                <Play :size="28" class="text-white ml-1" />
              </div>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">{{ $t('funnel.step1_cta.getStarted') }}</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.account.title') }}
            </h2>
            <form @submit.prevent="submitLeadAndContinue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.fullName') }}</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.fullName')" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.email') }}</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.email')" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.phone') }}</label>
                <input v-model="form.phone" type="tel" class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.phone')" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">{{ $t('funnel.account.consent') }}</span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">{{ $t('funnel.account.buttons.back') }}</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">{{ $t('funnel.account.buttons.continue') }}</UiButton>
              </div>
            </form>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.country.title') }}
            </h2>
            <p class="text-sm text-zinc-500">{{ $t('funnel.country.description') }}</p>
            <div class="space-y-4">
              <CountrySelect v-model="selectedCountry" />
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">{{ $t('funnel.account.buttons.back') }}</UiButton>
                <UiButton variant="primary" @click="saveCountryAndRedirect">{{ $t('funnel.country.access') }}</UiButton>
            </div>
          </div>
        </div>

        <!-- ================= PATH 2: ALREADY IN NM (already-in-nm) ================= -->
        <div v-else class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.already.step1.title') }}
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              {{ $t('funnel.already.step1.blurb') }}
            </p>
            <div class="p-5 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
              <h4 class="font-bold text-accent text-sm">{{ $t('funnel.already.whyTrainingTitle') }}</h4>
              <p class="text-xs text-zinc-650">
                {{ $t('funnel.already.whyTrainingText') }}
              </p>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">{{ $t('funnel.already.analyzeCta') }}</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.already.step2.title') }}
            </h2>
            <p class="text-sm text-zinc-500">{{ $t('funnel.already.challengesPrompt') }}</p>
            <div class="grid sm:grid-cols-2 gap-3">
              <label 
                v-for="chKey in challengeOptions" 
                :key="chKey" 
                class="flex items-center gap-3 p-4 bg-white/5 border rounded-xl cursor-pointer hover:border-accent transition"
                :class="selectedChallenges.includes(chKey) ? 'border-accent bg-accent/5' : 'border-zinc-200'"
              >
                <input 
                  type="checkbox" 
                  :value="chKey" 
                  v-model="selectedChallenges" 
                  class="rounded text-accent focus:ring-accent border-zinc-300" 
                />
                <span class="text-xs sm:text-sm font-semibold">{{ $t(chKey) }}</span>
              </label>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">{{ $t('funnel.account.buttons.back') }}</UiButton>
              <UiButton variant="primary" :disabled="selectedChallenges.length === 0" @click="nextStep">{{ $t('funnel.already.nextStep') }}</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.already.eliteTitle') }}
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              {{ $t('funnel.already.eliteDesc') }}
            </p>
            <div class="space-y-3">
              <div v-for="ch in selectedChallenges" :key="ch" class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                <span class="text-emerald-500 font-bold">✓</span>
                <span class="text-xs text-zinc-800 font-semibold">{{ getChallengeSolution(ch) }}</span>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">{{ $t('funnel.account.buttons.back') }}</UiButton>
              <UiButton variant="primary" @click="nextStep">{{ $t('funnel.already.matchWithMentor') }}</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 4" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              {{ $t('funnel.coach.assignedTitlePart1') }} <span class="nma-gradient-text">{{ $t('funnel.coach.assignedTitlePart2') }}</span>
            </h2>
            
            <div v-if="matchingAnimation" class="h-48 flex flex-col items-center justify-center gap-4">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              <p class="text-sm font-semibold animate-pulse text-zinc-400">{{ $t('funnel.coach.matching') }}</p>
            </div>

              <div v-else class="space-y-6 animate-fade-in">
              <div class="p-6 bg-emerald-50 border rounded-card flex gap-4 items-center" :class="{'border-emerald-300': true}">
                <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-emerald-100">
                  <img v-if="ownerStore.photoUrl" :src="ownerStore.photoUrl" alt="Coach photo" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-emerald-800 font-black text-xl">
                    {{ ownerInitials }}
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-emerald-700">{{ ownerStore.name }}</h4>
                  <p class="text-xs text-emerald-600">{{ ownerStore.intro || $t('funnel.coach.title') }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                  <p class="text-sm leading-relaxed text-zinc-600">{{ $t('funnel.coach.bookPrompt') }}</p>
                  <form @submit.prevent="submitLeadAndCompleteFlow" class="space-y-4">
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.fullName') }}</label>
                      <input v-model="form.fullName" type="text" required class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.fullName')" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.email') }}</label>
                      <input v-model="form.email" type="email" required class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.email')" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.account.labels.phone') }}</label>
                      <input v-model="form.phone" type="tel" required class="nma-input-glass" :placeholder="$t('funnel.account.placeholders.phone')" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{{ $t('funnel.country.title') }}</label>
                      <CountrySelect v-model="selectedCountry" />
                    </div>
                    <label class="flex items-start gap-3 cursor-pointer mt-4">
                      <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                      <span class="text-xs sm:text-sm text-zinc-650">{{ $t('funnel.coach.agree') }}</span>
                    </label>
                    <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                      <UiButton variant="ghost" @click="prevStep">{{ $t('funnel.account.buttons.back') }}</UiButton>
                      <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">{{ $t('funnel.coach.joinWhatsapp') }}</UiButton>
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-xs text-zinc-500">
      <p>{{ $t('footer.copyright') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getJourney } from '../data/learnerJourneys';
import { useRoute, useRouter } from 'vue-router';
import { Play } from 'lucide-vue-next';
import AppLogo from '../components/ui/AppLogo.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useCatalogStore } from '../stores/catalog';
import { useLeadsStore } from '../stores/leads';
import { useChatStore } from '../stores/chat';
import { useMemberStore } from '../stores/member';
import { useVideoPlayerStore } from '../stores/videoPlayer';
import { useSettingsStore } from '../stores/settings';
import { getFullMediaUrl } from '../api';

import CountrySelect from '../components/ui/CountrySelect.vue';
import { useOwnerStore } from '../stores/owner';
import { useTranslationsStore } from '../stores/translations';

import { joinGroup } from '../utils/whatsapp';
const route = useRoute();
const router = useRouter();

const ownerStore = useOwnerStore();
const translationsStore = useTranslationsStore();

const videoStore = useVideoPlayerStore();
const settingsStore = useSettingsStore();

const openVideo = (src, title, thumbnail = null) => {
  videoStore.open({ src, title, thumbnail });
};

const introVideoSrc = computed(() => {
  const s = settingsStore.settings?.risk_video || settingsStore.settings?.nm_video_url || 'https://www.youtube.com/embed/j-j72H2rJqA';
  return videoStore.resolveUrl(s);
});

const introVideoThumbnail = computed(() => {
  if (settingsStore.settings?.risk_video) {
    return settingsStore.settings?.risk_video_thumbnail || null;
  }
  return settingsStore.settings?.nm_video_url_thumbnail || settingsStore.settings?.nm_video_thumbnail || null;
});

const introVideoThumbnailUrl = computed(() => {
  if (introVideoThumbnail.value) {
    return getFullMediaUrl(introVideoThumbnail.value);
  }
  return '';
});

const playIntroVideo = () => openVideo(introVideoSrc.value, translationsStore.t('funnel.videoTitle'), introVideoThumbnail.value);

const catalogStore = useCatalogStore();
const leadsStore = useLeadsStore();
const chatStore = useChatStore();
const memberStore = useMemberStore();

const funnelId = computed(() => route.params.funnelId);

const currentStepIndex = ref(1);
const submitting = ref(false);
const selectedCountry = ref('NG');

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  consent: false,
});

onMounted(async () => {
  await catalogStore.fetchCountries();
  const saved = localStorage.getItem('selected_country');
  if (saved) {
    selectedCountry.value = saved;
  }
  await settingsStore.fetchSettings();
  await ownerStore.fetchProfile();
  // Debug: log funnel info for inspection
  try {
    // funnelId is a computed ref — log its value and resolved journey
    console.log('DEBUG FunnelPage: route.params=', route.params);
    console.log('DEBUG FunnelPage: funnelId=', funnelId.value);
    console.log('DEBUG FunnelPage: journey=', getJourney(funnelId.value));
  } catch (e) {
    console.warn('DEBUG FunnelPage: failed to log funnel info', e);
  }
});

// Paths specific content
const challengeOptions = [
  // translation keys used in template
  // these are labels drawn from translations.json
  'funnel.challengeOptions.recruiting',
  'funnel.challengeOptions.rejection',
  'funnel.challengeOptions.retention',
  'funnel.challengeOptions.upline',
  'funnel.challengeOptions.habits',
  'funnel.challengeOptions.presentation'
];
const selectedChallenges = ref([]);

const getChallengeSolution = (challenge) => {
  // Resolve solution texts from translations so they're localizable
  try {
    if (typeof challenge === 'string') {
      if (challenge.endsWith('.recruiting') || challenge.includes('Recruiting')) return translationsStore.t('funnel.solutions.recruiting');
      if (challenge.endsWith('.rejection') || challenge.includes('rejection')) return translationsStore.t('funnel.solutions.rejection');
      if (challenge.endsWith('.retention') || challenge.includes('retention')) return translationsStore.t('funnel.solutions.retention');
      if (challenge.endsWith('.upline') || challenge.includes('upline')) return translationsStore.t('funnel.solutions.upline');
      if (challenge.endsWith('.habits') || challenge.includes('habits')) return translationsStore.t('funnel.solutions.habits');
    }
  } catch (e) {
    /* ignore and fallback */
  }
  return translationsStore.t('funnel.solutions.default');
};

const exploreQs = ref({
  hours: '5-10',
  coachable: ''
});

const assessment = ref({
  currentCompany: '',
  volume: '',
  reasons: ''
});

const packages = [
  { name: 'Neoverse Package', desc: 'Entry-level packaging', price: '$375' },
  { name: 'Technoverse Package', desc: 'Highly popular for team duplications', price: '$925' },
  { name: 'Megaverse Package', desc: 'For serious leaders looking for 31 accounts leverage', price: '$3,600' }
];

const matchingAnimation = ref(false);

const ownerInitials = computed(() => {
  const n = ownerStore.name || '';
  return n.split(' ').map(s => s[0] || '').join('').slice(0,2).toUpperCase();
});

const totalSteps = computed(() => {
  if (funnelId.value === 'new-to-nm') return 3;
  if (funnelId.value === 'already-in-nm') return 4;
  if (funnelId.value === 'switch-companies') return 3;
  if (funnelId.value === 'exploring') return 3;
  if (funnelId.value === 'income-diversification') return 3;
  if (funnelId.value === 'jobless') return 2;
  if (funnelId.value === 'fast-track') return 2;
  return 3;
});

const nextStep = () => {
  if (funnelId.value === 'already-in-nm' && currentStepIndex.value === 3) {
    matchingAnimation.value = true;
    setTimeout(() => {
      matchingAnimation.value = false;
    }, 2000);
  }
  currentStepIndex.value++;
};

const prevStep = () => {
  if (currentStepIndex.value > 1) currentStepIndex.value--;
};

// Submitting Leads
const submitLeadAndContinue = async () => {
  submitting.value = true;
  try {
    const segmentLabel = getSegmentLabel(funnelId.value);
    const challenges = getChallengesForPayload();
    
    try {
      await leadsStore.submitLead({
        fullName: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone,
        country: selectedCountry.value,
        profileType: segmentLabel,
        challenges: challenges,
        consent: form.value.consent
      });
    } catch (apiErr) {
      // API unavailable — log but don't block the user flow
      console.warn('[leads] API submit failed (offline/dev), continuing anyway:', apiErr);
    }
    
    chatStore.markLeadRegistered();
    localStorage.setItem('chat_visitor_name', form.value.fullName);
    localStorage.setItem('chat_visitor_email', form.value.email);
    localStorage.setItem('chat_visitor_phone', form.value.phone || '');
    
    try {
      await chatStore.initGuestSession(form.value.fullName, form.value.email, form.value.phone);
    } catch (_e) { /* session init failure is non-fatal */ }
    
    nextStep();
  } finally {
    submitting.value = false;
  }
};

const saveCountryAndRedirect = () => {
  catalogStore.selectCountry(selectedCountry.value);
  const segmentLabel = getSegmentLabel(funnelId.value);
  const journey = memberStore.registerFromLead({
    fullName: form.value.fullName || 'Explorer',
    email: form.value.email || `explore-${Date.now()}@nma.bi`,
    country: selectedCountry.value,
    profileType: segmentLabel
  });
  
  // Check if country has office
  const countryData = catalogStore.countryByCode(selectedCountry.value);
  if (countryData && !countryData.hasOffice) {
    router.push('/join-whatsapp-group');
  } else {
    router.push(journey.afterSignupRoute);
  }
};

const submitLeadAndCompleteFlow = async () => {
  submitting.value = true;
  try {
    const segmentLabel = getSegmentLabel(funnelId.value);
    const challenges = getChallengesForPayload();
    
    try {
      await leadsStore.submitLead({
        fullName: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone,
        country: selectedCountry.value,
        profileType: segmentLabel,
        challenges: challenges,
        consent: form.value.consent
      });
    } catch (apiErr) {
      // API unavailable — log but don't block the user flow
      console.warn('[leads] API submit failed (offline/dev), continuing anyway:', apiErr);
    }
    
    chatStore.markLeadRegistered();
    localStorage.setItem('chat_visitor_name', form.value.fullName);
    localStorage.setItem('chat_visitor_email', form.value.email);
    localStorage.setItem('chat_visitor_phone', form.value.phone || '');
    
    try {
      await chatStore.initGuestSession(form.value.fullName, form.value.email, form.value.phone);
    } catch (_e) { /* session init failure is non-fatal */ }
    
    catalogStore.selectCountry(selectedCountry.value);
    const journey = memberStore.registerFromLead({
      fullName: form.value.fullName,
      email: form.value.email,
      country: selectedCountry.value,
      profileType: segmentLabel
    });
    
    // Check if country has office
    const countryData = catalogStore.countryByCode(selectedCountry.value);
    if (countryData && !countryData.hasOffice) {
      router.push('/join-whatsapp-group');
    } else {
      // Redirect to join group page after registration
      joinGroup(settingsStore, 'new-to-mlm');
      router.push(journey.afterSignupRoute);
    }
  } finally {
    submitting.value = false;
  }
};

const getSegmentLabel = (fid) => {
  switch (fid) {
    case 'new-to-nm': return translationsStore.t('funnel.segment.new-to-nm');
    case 'already-in-nm': return translationsStore.t('funnel.segment.already-in-nm');
    case 'switch-companies': return translationsStore.t('funnel.segment.switch-companies');
    case 'exploring': return translationsStore.t('funnel.segment.exploring');
    case 'income-diversification': return translationsStore.t('funnel.segment.income-diversification');
    case 'jobless': return translationsStore.t('funnel.segment.jobless');
    case 'fast-track': return translationsStore.t('funnel.segment.fast-track');
    default: return translationsStore.t('funnel.segment.exploring');
  }
};

const getChallengesForPayload = () => {
  if (funnelId.value === 'already-in-nm') return selectedChallenges.value;
  if (funnelId.value === 'switch-companies') return [`Current Company: ${assessment.value.currentCompany}`, `Volume: ${assessment.value.volume}`, `Reasons: ${assessment.value.reasons}`];
  if (funnelId.value === 'exploring') return [`Explore hours: ${exploreQs.value.hours}`, `Explore coachable: ${exploreQs.value.coachable}`];
  return [];
};
</script>

<style scoped>
.funnel-page p {
  text-align: justify;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
