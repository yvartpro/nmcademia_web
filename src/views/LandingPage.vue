<template>
  <OnboardingShell
    :current-step="currentStep"
    :total-steps="9"
    :logo-url="logoUrl"
    :show-footer="currentStep > 1"
  >
    <!-- Step 1: Hero -->
    <div v-if="currentStep === STEPS.HERO" class="space-y-8 motion-safe:animate-fade-in text-center sm:text-left">
      <div class="space-y-6 max-w-3xl mx-auto">
        <UiSectionLabel>Welcome Visionary</UiSectionLabel>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight leading-[1.15] text-zinc-900 dark:text-white">
          Network Marketing Academia is not here to entertain you—
          <span class="nma-gradient-text">it is here to confront you.</span>
        </h2>
        <div class="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p
            v-for="(para, i) in heroParagraphs"
            :key="i"
            :class="{
              'border-l-4 border-accent pl-4 py-2 font-medium text-zinc-800 dark:text-zinc-200 bg-accent-muted/40 dark:bg-accent/10 rounded-r-xl text-left': i === 1 && heroParagraphs.length > 2,
            }"
          >
            {{ para }}
          </p>
        </div>
      </div>

      <!-- Proof strip -->
      <div class="grid grid-cols-3 gap-3 max-w-lg mx-auto sm:mx-0">
        <div v-for="stat in proofStats" :key="stat.label" class="nma-card p-3 text-center">
          <p class="text-lg sm:text-xl font-display font-bold nma-gradient-text">{{ stat.value }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
        <UiButton variant="primary" size="lg" @click="nextStep">
          {{ settings['landing_cta_text'] || 'Enter the Vision' }} →
        </UiButton>
      </div>
    </div>

    <!-- Step 2: Mission -->
    <div v-else-if="currentStep === STEPS.MISSION" class="space-y-6 motion-safe:animate-fade-in">
      <UiSectionLabel>Mission</UiSectionLabel>
      <h3 class="text-2xl font-display font-bold">A wake-up call for a new economy</h3>
      <p class="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{{ settings['mission_statement'] }}</p>
      <StepNav @back="prevStep" @next="nextStep" />
    </div>

    <!-- Step 3: Objectives -->
    <div v-else-if="currentStep === STEPS.OBJECTIVES" class="space-y-6 motion-safe:animate-fade-in">
      <UiSectionLabel>Objectives</UiSectionLabel>
      <h3 class="text-2xl font-display font-bold">The defining business model of the 21st century</h3>
      <p class="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{{ settings['objectives_statement'] }}</p>
      <StepNav @back="prevStep" @next="nextStep" />
    </div>

    <!-- Step 4: Vision -->
    <div v-else-if="currentStep === STEPS.VISION" class="space-y-6 motion-safe:animate-fade-in">
      <UiSectionLabel>Vision</UiSectionLabel>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="nma-card p-4 border-zinc-300 dark:border-zinc-700">
          <p class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Some see</p>
          <p class="font-display font-bold text-lg">Impossibility</p>
        </div>
        <div class="nma-card p-4 border-accent/40 bg-accent-muted/30 dark:bg-accent/10">
          <p class="text-xs font-bold uppercase tracking-wider text-accent mb-2">Others see</p>
          <p class="font-display font-bold text-lg nma-gradient-text">The future before it arrives</p>
        </div>
      </div>
      <p class="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{{ settings['vision_statement'] }}</p>
      <StepNav @back="prevStep" @next="nextStep" />
    </div>

    <!-- Step 5: Video -->
    <div v-else-if="currentStep === STEPS.NM_VIDEO" class="space-y-6 motion-safe:animate-fade-in">
      <UiSectionLabel>Education</UiSectionLabel>
      <h3 class="text-xl font-display font-bold">What is network marketing?</h3>
      <div v-if="nmVideoUrl" class="aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow">
        <iframe
          :src="nmVideoUrl"
          title="What is Network Marketing"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
      <p v-else class="text-sm text-zinc-500 nma-card p-6 text-center">Video will appear here once configured in Site Settings.</p>
      <StepNav @back="prevStep" @next="nextStep" />
    </div>

    <!-- Step 6: Segment -->
    <div v-else-if="currentStep === STEPS.SEGMENT" class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h3 class="text-2xl font-display font-bold">Which best describes you?</h3>
        <p class="text-sm text-zinc-500 mt-1">Select the option that mirrors your current situation.</p>
      </div>
      <div class="space-y-2 max-h-[360px] overflow-y-auto nma-scrollbar pr-1" role="radiogroup">
        <UiSelectionCard
          v-for="(opt, idx) in segmentOptions"
          :key="idx"
          :label="opt"
          :icon="segmentIcons[idx] || '→'"
          :selected="selectedSegment === opt"
          @select="selectedSegment = opt"
        />
        <p v-if="selectedSegment" class="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
          {{ segmentJourneyHint(selectedSegment) }}
        </p>
      </div>
      <StepNav @back="prevStep" :next-disabled="!selectedSegment" @next="submitSegmentSelection" next-label="Continue" />
    </div>

    <!-- Step 7A: Already in NM -->
    <div v-else-if="currentStep === STEPS.PROFILE && isAlreadyInNM" class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h4 class="text-xl font-display font-bold">Congratulations on Your Decision</h4>
        <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-line">{{ settings['already_in_nm_message'] }}</p>
      </div>

      <details class="nma-card group">
        <summary class="p-4 cursor-pointer font-semibold text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          Why Many Distributors Fail
          <span class="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <ul class="px-4 pb-4 space-y-2">
          <li v-for="(reason, i) in whyFailReasons" :key="i" class="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span class="text-red-500 shrink-0">×</span>{{ reason }}
          </li>
        </ul>
      </details>

      <details class="nma-card group" open>
        <summary class="p-4 cursor-pointer font-semibold text-sm text-success flex items-center justify-between">
          Why Having an Experienced Coach Matters
          <span class="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <ul class="px-4 pb-4 space-y-2">
          <li v-for="(benefit, i) in coachingBenefits" :key="i" class="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span class="text-success shrink-0">✓</span>{{ benefit }}
          </li>
        </ul>
      </details>

      <div>
        <label class="block text-sm font-medium mb-2">What challenges have you experienced?</label>
        <textarea
          v-model="challengesText"
          rows="3"
          placeholder="E.g., Lack of duplication, team members quitting..."
          class="nma-input resize-none"
        />
      </div>

      <StepNav
        @back="prevStep"
        @next="nextStep"
        :next-label="settings['coaching_cta_text'] || 'Get Coaching & Mentorship'"
      />
    </div>

    <!-- Step 7B: New / Exploring -->
    <div v-else-if="currentStep === STEPS.PROFILE && !isAlreadyInNM" class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h4 class="text-xl font-display font-bold">Welcome to Network Marketing Academia</h4>
        <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-line">{{ settings['new_exploring_message'] }}</p>
        <p class="text-sm font-semibold mt-4">Are you: (check all that apply)</p>
      </div>
      <div class="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto nma-scrollbar">
        <UiChip
          v-for="(subOpt, idx) in listOptions"
          :key="idx"
          :label="subOpt"
          :selected="selectedListOptions.includes(subOpt)"
          @toggle="toggleListOption(subOpt)"
        />
      </div>
      <StepNav @back="prevStep" @next="nextStep" next-label="Proceed" />
    </div>

    <!-- Step 8: Country -->
    <div v-else-if="currentStep === STEPS.COUNTRY" class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h4 class="text-xl font-display font-bold">Your Location</h4>
        <p class="text-sm text-zinc-500 mt-1">Where are you joining from?</p>
      </div>
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Select Your Country 🌍</label>
        <select v-model="selectedCountry" class="nma-input">
          <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
            {{ c.name }}
          </option>
        </select>
      </div>
      <StepNav @back="prevStep" @next="nextStep" />
    </div>

    <!-- Step 9: Personal -->
    <div v-else-if="currentStep === STEPS.PERSONAL" class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h4 class="text-xl font-display font-bold">Personal Information</h4>
        <p class="text-sm text-zinc-500 mt-1">Enter your details to join the ecosystem.</p>
      </div>
      <form @submit.prevent="submitContactDetails" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
          <input v-model="form.fullName" type="text" required class="nma-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
          <input v-model="form.email" type="email" required class="nma-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone Number (Optional)</label>
          <input v-model="form.phone" type="tel" class="nma-input" />
        </div>
        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
          <span class="text-sm text-zinc-600 dark:text-zinc-400">
            By signing up, I agree to receive learning materials, updates, and communications from Network Marketing Academia.
          </span>
        </label>
        <p v-if="errorMessage" class="text-sm text-red-500 font-medium">{{ errorMessage }}</p>
        <StepNav
          @back="prevStep"
          :next-disabled="submitting || !form.consent"
          :next-loading="submitting"
          next-label="Enter the Academia"
          is-submit
        />
      </form>
    </div>
  </OnboardingShell>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import OnboardingShell from '../layouts/OnboardingShell.vue';
import UiButton from '../components/ui/UiButton.vue';
import UiSectionLabel from '../components/ui/UiSectionLabel.vue';
import UiSelectionCard from '../components/ui/UiSelectionCard.vue';
import UiChip from '../components/ui/UiChip.vue';
import StepNav from '../components/onboarding/StepNav.vue';
import { useCatalogStore } from '../stores/catalog';
import { useLeadsStore } from '../stores/leads';
import { useChatStore } from '../stores/chat';
import { useSettingsStore } from '../stores/settings';
import { useMemberStore } from '../stores/member';
import { getFullMediaUrl } from '../api';
import { resolveJourneyId, getJourney } from '../data/learnerJourneys';

function segmentJourneyHint(segment) {
  return getJourney(resolveJourneyId(segment)).welcomeLine;
}

const STEPS = {
  HERO: 1,
  MISSION: 2,
  OBJECTIVES: 3,
  VISION: 4,
  NM_VIDEO: 5,
  SEGMENT: 6,
  PROFILE: 7,
  COUNTRY: 8,
  PERSONAL: 9,
};

const router = useRouter();
const catalogStore = useCatalogStore();
const leadsStore = useLeadsStore();
const chatStore = useChatStore();
const settingsStore = useSettingsStore();
const memberStore = useMemberStore();

const currentStep = ref(1);
const selectedSegment = ref(null);
const challengesText = ref('');
const selectedListOptions = ref([]);
const selectedCountry = ref('NG');
const submitting = ref(false);
const errorMessage = ref('');

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  consent: false,
});

const settings = computed(() => settingsStore.settings);

const logoUrl = computed(() => {
  const url = settings.value['logo_url'];
  return url ? getFullMediaUrl(url) : '';
});

const nmVideoUrl = computed(() => settings.value['nm_video_url'] || settings.value['video_url'] || '');

const proofStats = [
  { value: '50K+', label: 'Learners' },
  { value: '40+', label: 'Countries' },
  { value: '4.9★', label: 'Rating' },
];

const segmentIcons = ['🌱', '📈', '🔄', '🔍', '💰', '🎯', '🔥'];

const defaultHeroParagraphs = [
  'The world you were prepared for is no longer the world you are living in. Jobs are shrinking, automation is rising, inflation is eating salaries, and the promise that education alone guarantees freedom is quietly collapsing. Yet most people still wait, hoping the old system will somehow fix what it has already outgrown.',
  'This is a new economy. Power no longer belongs to those who simply work hard, but to those who understand networks, influence, and digital connection.',
  'Network Marketing Academia exists to train a generation that refuses dependency—people who build, lead, and create income through human networks instead of waiting for permission. The only real question now is not whether the world is changing—but whether you will change with it or be left explaining why you didn\'t.',
];

const heroParagraphs = computed(() => {
  const text = settings.value['landing_hero_text'];
  if (!text || !text.trim()) return defaultHeroParagraphs;
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts : defaultHeroParagraphs;
});

const segmentOptions = computed(() => {
  try { return JSON.parse(settingsStore.settings['segment_options']); } catch {
    return ['I am new to network marketing', 'I am already in network marketing', 'I am in network marketing but not satisfied and want to switch companies', 'I am just exploring opportunities', 'I am tired of depending on one source of income', 'I am tired of being jobless', 'I want this business by all means'];
  }
});

const listOptions = computed(() => {
  try { return JSON.parse(settingsStore.settings['list_options']); } catch {
    return ['Tired of depending on a single income?', 'Tired of working hard but not progressing financially?', 'Tired of job uncertainty and rising living costs?', 'A single mother looking for a flexible way to support your family?', 'An employee looking for an additional source of income?', 'Unemployed and searching for an opportunity?', 'A student exploring future possibilities?', 'An entrepreneur looking to expand your income streams?'];
  }
});

const whyFailReasons = computed(() => {
  try { return JSON.parse(settingsStore.settings['nm_why_fail_reasons']); } catch { return []; }
});

const coachingBenefits = computed(() => {
  try { return JSON.parse(settingsStore.settings['nm_coaching_benefits']); } catch { return []; }
});

const isAlreadyInNM = computed(() =>
  selectedSegment.value === 'I am already in network marketing'
  || selectedSegment.value === 'I am in network marketing but not satisfied and want to switch companies'
);

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    settingsStore.fetchSettings(),
  ]);
  if (catalogStore.countries.length > 0) {
    const saved = localStorage.getItem('selected_country');
    if (saved && catalogStore.countries.some((c) => c.code === saved)) {
      selectedCountry.value = saved;
    } else {
      const ng = catalogStore.countries.find((c) => c.code === 'NG');
      selectedCountry.value = ng ? 'NG' : catalogStore.countries[0].code;
    }
  }
});

const nextStep = () => { currentStep.value++; };
const prevStep = () => { currentStep.value--; };

const toggleListOption = (opt) => {
  const index = selectedListOptions.value.indexOf(opt);
  if (index === -1) selectedListOptions.value.push(opt);
  else selectedListOptions.value.splice(index, 1);
};

const submitSegmentSelection = () => { nextStep(); };

const submitContactDetails = async () => {
  submitting.value = true;
  errorMessage.value = '';
  try {
    const payload = {
      fullName: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      country: selectedCountry.value,
      profileType: selectedSegment.value,
      challenges: isAlreadyInNM.value ? challengesText.value : selectedListOptions.value,
      consent: form.value.consent,
    };

    await leadsStore.submitLead(payload);
    chatStore.markLeadRegistered();

    localStorage.setItem('chat_visitor_name', form.value.fullName);
    localStorage.setItem('chat_visitor_email', form.value.email);
    localStorage.setItem('chat_visitor_phone', form.value.phone || '');

    try {
      await chatStore.initGuestSession(form.value.fullName, form.value.email, form.value.phone);
    } catch (e) {
      console.warn('Silent chat setup warning:', e);
    }

    catalogStore.selectCountry(selectedCountry.value);
    const journey = memberStore.registerFromLead({
      fullName: form.value.fullName,
      email: form.value.email,
      country: selectedCountry.value,
      profileType: selectedSegment.value,
    });
    router.push(journey.afterSignupRoute);
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Submission failed. Please check your inputs.';
  } finally {
    submitting.value = false;
  }
};
</script>
