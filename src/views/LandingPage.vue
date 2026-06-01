<template>
  <div class="min-h-screen flex flex-col font-sans transition-colors duration-300">
    <!-- Header Navigation -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] sticky top-0 z-50 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            alt="Network Marketing Academia"
            class="w-9 h-9 rounded object-contain"
          />
          <div v-else class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
            NMA
          </div>
          <div>
            <h1 class="font-display font-semibold text-base leading-tight text-gray-900 dark:text-gray-100">
              Network Marketing Academia
            </h1>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button @click="themeStore.toggleTheme" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Toggle Theme">
            <svg v-if="themeStore.isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <router-link to="/admin/login" class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Admin
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Wizard Area -->
    <main class="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
      <div class="max-w-2xl w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-sm p-8 md:p-10 shadow-sm relative overflow-hidden">
        
        <!-- Step 1: Hero Confrontation -->
        <div v-if="currentStep === 1" class="space-y-8 animate-fade-in">
          <div class="space-y-6">
            <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              Welcome Visionary
            </span>
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
              Network Marketing Academia is not here to entertain you—it is here to confront you.
            </h2>
            <div class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
              <p v-for="(para, i) in heroParagraphs" :key="i" :class="{ 'border-l-4 border-blue-600 pl-4 py-1 font-medium text-gray-900 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/20': i === 1 && heroParagraphs.length > 2 }">
                {{ para }}
              </p>
            </div>
          </div>
          <button @click="nextStep" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-colors flex items-center justify-center gap-2">
            <span>{{ settings['landing_cta_text'] || 'Enter the Vision' }}</span>
            <span>→</span>
          </button>
        </div>

        <!-- Step 2: Mission -->
        <div v-else-if="currentStep === STEPS.MISSION" class="space-y-6 animate-fade-in">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Mission</span>
          <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{{ settings['mission_statement'] }}</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button type="button" @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">Continue</button>
          </div>
        </div>

        <!-- Step 3: Objectives -->
        <div v-else-if="currentStep === STEPS.OBJECTIVES" class="space-y-6 animate-fade-in">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Objectives</span>
          <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{{ settings['objectives_statement'] }}</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button type="button" @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">Continue</button>
          </div>
        </div>

        <!-- Step 4: Vision -->
        <div v-else-if="currentStep === STEPS.VISION" class="space-y-6 animate-fade-in">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Vision</span>
          <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{{ settings['vision_statement'] }}</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button type="button" @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">Continue</button>
          </div>
        </div>

        <!-- Step 5: What is network marketing (video) -->
        <div v-else-if="currentStep === STEPS.NM_VIDEO" class="space-y-6 animate-fade-in">
          <span class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Education</span>
          <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">What is network marketing?</h3>
          <div v-if="nmVideoUrl" class="aspect-video bg-black rounded overflow-hidden">
            <iframe
              :src="nmVideoUrl"
              title="What is Network Marketing"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
          <p v-else class="text-sm text-gray-500">Video will appear here once configured in Site Settings.</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button type="button" @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">Continue</button>
          </div>
        </div>

        <!-- Step 6: "Which best describes you?" -->
        <div v-else-if="currentStep === STEPS.SEGMENT" class="space-y-8 animate-fade-in">
          <div class="space-y-2">
            <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white">Which best describes you?</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Select the option that mirrors your current situation to calibrate your guide.</p>
          </div>

          <div class="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="(opt, idx) in segmentOptions" 
              :key="idx"
              @click="selectedSegment = opt"
              :class="[
                'border p-4 rounded cursor-pointer transition-colors flex items-start gap-3',
                selectedSegment === opt 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                :class="selectedSegment === opt ? 'border-blue-600 dark:border-blue-400 bg-blue-600' : 'border-gray-400 dark:border-gray-600'">
                <div v-if="selectedSegment === opt" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-200" :class="{'text-blue-700 dark:text-blue-300': selectedSegment === opt}">{{ opt }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button 
              @click="submitSegmentSelection" 
              :disabled="!selectedSegment"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 3A: Already in NM -->
        <div v-else-if="currentStep === STEPS.PROFILE && isAlreadyInNM" class="space-y-6 animate-fade-in">
          <div class="space-y-3">
            <h4 class="text-xl font-display font-bold text-gray-900 dark:text-white">Congratulations on Your Decision</h4>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ settings['already_in_nm_message'] }}</p>
          </div>

          <div class="space-y-3">
            <h5 class="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Why Many Distributors Fail</h5>
            <ul class="space-y-2">
              <li v-for="(reason, i) in whyFailReasons" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-red-600 dark:text-red-400 mt-0.5 shrink-0 font-bold">×</span>
                <span>{{ reason }}</span>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h5 class="text-sm font-bold text-green-600 dark:text-green-500 uppercase tracking-wider">Why Having an Experienced Coach Matters</h5>
            <ul class="space-y-2">
              <li v-for="(benefit, i) in coachingBenefits" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-green-600 dark:text-green-500 mt-0.5 shrink-0 font-bold">✓</span>
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">What challenges have you experienced?</label>
            <textarea 
              v-model="challengesText"
              rows="3" 
              placeholder="E.g., Lack of duplication, team members quitting, mentorship issues..."
              class="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">
              {{ settings['coaching_cta_text'] || 'Get Coaching & Mentorship' }}
            </button>
          </div>
        </div>

        <!-- Step 3B: New / Exploring -->
        <div v-else-if="currentStep === STEPS.PROFILE && !isAlreadyInNM" class="space-y-6 animate-fade-in">
          <div class="space-y-4">
            <h4 class="text-xl font-display font-bold text-gray-900 dark:text-white">Welcome to Network Marketing Academia.</h4>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ settings['new_exploring_message'] }}</p>
            <p class="text-gray-900 dark:text-gray-300 text-sm font-semibold">Are you: (check all that apply)</p>
          </div>

          <div class="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="(subOpt, idx) in listOptions" 
              :key="idx"
              @click="toggleListOption(subOpt)"
              :class="[
                'border p-3 rounded cursor-pointer transition-colors flex items-center gap-3 text-sm',
                selectedListOptions.includes(subOpt) 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <input type="checkbox" :checked="selectedListOptions.includes(subOpt)" class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-0 pointer-events-none" />
              <span>{{ subOpt }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button @click="nextStep" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm">Proceed</button>
          </div>
        </div>

        <!-- Step 8: Country -->
        <div v-else-if="currentStep === STEPS.COUNTRY" class="space-y-6 animate-fade-in">
          <div class="space-y-1">
            <h4 class="text-xl font-display font-bold text-gray-900 dark:text-white">Your Location</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Select your country to tailor currency pricing models and regional compensation structures.</p>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Select Your Country</label>
            <select 
              v-model="selectedCountry" 
              class="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <button @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
            <button 
              @click="nextStep"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors text-sm"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 9: Personal Details Form -->
        <div v-else-if="currentStep === STEPS.PERSONAL" class="space-y-6 animate-fade-in">
          <div class="space-y-1">
            <h4 class="text-xl font-display font-bold text-gray-900 dark:text-white">Personal Information</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Enter your details to create your visitor profile and join the ecosystem.</p>
          </div>

          <form @submit.prevent="submitContactDetails" class="space-y-4">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                v-model="form.fullName" 
                required
                class="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                v-model="form.email" 
                required
                class="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Phone Number (Optional)</label>
              <input 
                type="tel" 
                v-model="form.phone" 
                class="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div class="flex items-start gap-3 mt-4">
              <input 
                type="checkbox" 
                id="consent" 
                v-model="form.consent" 
                required
                class="mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-0 cursor-pointer" 
              />
              <label for="consent" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                By signing up, I agree to receive learning materials, updates, and communications from Network Marketing Academia.
              </label>
            </div>

            <div v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 font-medium">{{ errorMessage }}</div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
              <button type="button" @click="prevStep" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back</button>
              <button 
                type="submit"
                :disabled="submitting || !form.consent"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded transition-colors disabled:opacity-50 text-sm"
              >
                {{ submitting ? 'Processing...' : 'Enter the Academia' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-500">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Network Marketing Academia. All rights reserved.</p>
        <p class="hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer transition">Official Partner: Alliance In Motion Global</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../stores/theme';
import { useCatalogStore } from '../stores/catalog';
import { useLeadsStore } from '../stores/leads';
import { useChatStore } from '../stores/chat';
import { useSettingsStore } from '../stores/settings';
import { getFullMediaUrl } from '../api';

const STEPS = {
  HERO: 1,
  MISSION: 2,
  OBJECTIVES: 3,
  VISION: 4,
  NM_VIDEO: 5,
  SEGMENT: 6,
  PROFILE: 7,
  COUNTRY: 8,
  PERSONAL: 9
};

const themeStore = useThemeStore();
const router = useRouter();
const catalogStore = useCatalogStore();
const leadsStore = useLeadsStore();
const chatStore = useChatStore();
const settingsStore = useSettingsStore();

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
  consent: false
});

// Expose settings directly for template binding
const settings = computed(() => settingsStore.settings);

const logoUrl = computed(() => {
  const url = settings.value['logo_url'];
  return url ? getFullMediaUrl(url) : '';
});

const nmVideoUrl = computed(() => settings.value['nm_video_url'] || settings.value['video_url'] || '');

const defaultHeroParagraphs = [
  'The world you were prepared for is no longer the world you are living in. Jobs are shrinking, automation is rising, inflation is eating salaries, and the promise that education alone guarantees freedom is quietly collapsing. Yet most people still wait, hoping the old system will somehow fix what it has already outgrown.',
  'This is a new economy. Power no longer belongs to those who simply work hard, but to those who understand networks, influence, and digital connection.',
  'Network Marketing Academia exists to train a generation that refuses dependency—people who build, lead, and create income through human networks instead of waiting for permission. The only real question now is not whether the world is changing—but whether you will change with it or be left explaining why you didn’t.'
];

const heroParagraphs = computed(() => {
  const text = settings.value['landing_hero_text'];
  if (!text || !text.trim()) return defaultHeroParagraphs;
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts : defaultHeroParagraphs;
});

// Parse JSON arrays from settings, with static fallbacks
const segmentOptions = computed(() => {
  try { return JSON.parse(settingsStore.settings['segment_options']); } catch {
    return ['I am new to network marketing','I am already in network marketing','I am in network marketing but not satisfied and want to switch companies','I am just exploring opportunities','I am tired of depending on one source of income','I am tired of being jobless','I want this business by all means'];
  }
});

const listOptions = computed(() => {
  try { return JSON.parse(settingsStore.settings['list_options']); } catch {
    return ['Tired of depending on a single income?','Tired of working hard but not progressing financially?','Tired of job uncertainty and rising living costs?','A single mother looking for a flexible way to support your family?','An employee looking for an additional source of income?','Unemployed and searching for an opportunity?','A student exploring future possibilities?','An entrepreneur looking to expand your income streams?'];
  }
});

const whyFailReasons = computed(() => {
  try { return JSON.parse(settingsStore.settings['nm_why_fail_reasons']); } catch { return []; }
});

const coachingBenefits = computed(() => {
  try { return JSON.parse(settingsStore.settings['nm_coaching_benefits']); } catch { return []; }
});

const isAlreadyInNM = computed(() => {
  return selectedSegment.value === 'I am already in network marketing' || 
         selectedSegment.value === 'I am in network marketing but not satisfied and want to switch companies';
});

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCountries(),
    settingsStore.fetchSettings()
  ]);
  if (catalogStore.countries.length > 0) {
    // default to stored country or Nigeria if available
    const saved = localStorage.getItem('selected_country');
    if (saved && catalogStore.countries.some(c => c.code === saved)) {
      selectedCountry.value = saved;
    } else {
      const ng = catalogStore.countries.find(c => c.code === 'NG');
      selectedCountry.value = ng ? 'NG' : catalogStore.countries[0].code;
    }
  }
});

const nextStep = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

const toggleListOption = (opt) => {
  const index = selectedListOptions.value.indexOf(opt);
  if (index === -1) {
    selectedListOptions.value.push(opt);
  } else {
    selectedListOptions.value.splice(index, 1);
  }
};

const submitSegmentSelection = () => {
  nextStep();
};

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
      challenges: isAlreadyInNM.value 
        ? challengesText.value 
        : selectedListOptions.value,
      consent: form.value.consent
    };
    
    // Save to leads DB table
    await leadsStore.submitLead(payload);

    chatStore.markLeadRegistered();

    // Set visitor identity for chat (returning users skip registration)
    localStorage.setItem('chat_visitor_name', form.value.fullName);
    localStorage.setItem('chat_visitor_email', form.value.email);
    localStorage.setItem('chat_visitor_phone', form.value.phone || '');

    // Initialize or resume chat session
    try {
      await chatStore.initGuestSession(form.value.fullName, form.value.email, form.value.phone);
    } catch (e) {
      console.warn('Silent chat setup warning:', e);
    }

    catalogStore.selectCountry(selectedCountry.value);
    router.push('/presentation');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Submission failed. Please check your inputs.';
  } finally {
    submitting.value = false;
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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.05);
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.4);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
