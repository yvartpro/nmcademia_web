<template>
  <div class="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between font-sans overflow-x-hidden relative">
    <!-- Glowing background accents -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Header Navigation -->
    <header class="border-b border-gray-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-900 text-lg shadow-lg shadow-amber-500/20">
            NMA
          </div>
          <div>
            <h1 class="font-display font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
              Network Marketing Academia
            </h1>
            <p class="text-[10px] text-gray-400 tracking-widest uppercase">The Science of Human Networks</p>
          </div>
        </div>
        <router-link to="/admin/login" class="text-xs text-gray-400 hover:text-amber-400 border border-gray-700 hover:border-amber-400 px-3 py-1.5 rounded-full transition-all duration-300">
          Admin Portal
        </router-link>
      </div>
    </header>

    <!-- Main Wizard Area -->
    <main class="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
      <div class="max-w-2xl w-full bg-slate-900/40 border border-gray-800 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        
        <!-- Step 1: Hero Confrontation -->
        <div v-if="currentStep === 1" class="space-y-8 animate-fade-in">
          <div class="space-y-6">
            <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Welcome Visionary
            </span>
            <h2 class="text-3xl md:text-4xl font-display font-extrabold tracking-tight leading-tight">
              Network Marketing Academy is <span class="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">not here to entertain you</span>—it is here to confront you.
            </h2>
            <div class="text-gray-300 text-sm md:text-base leading-relaxed space-y-4 font-light">
              <p>
                The world you were prepared for is no longer the world you are living in. Jobs are shrinking, automation is rising, inflation is eating salaries, and the promise that education alone guarantees freedom is quietly collapsing. Yet most people still wait, hoping the old system will somehow fix what it has already outgrown.
              </p>
              <p class="border-l-2 border-amber-500 pl-4 py-1 italic bg-amber-500/5 text-gray-200">
                This is a new economy. Power no longer belongs to those who simply work hard, but to those who understand networks, influence, and digital connection.
              </p>
              <p>
                Network Marketing Academy exists to train a generation that refuses dependency—people who build, lead, and create income through human networks instead of waiting for permission. The only real question now is not whether the world is changing—but whether you will change with it or be left explaining why you didn’t.
              </p>
            </div>
          </div>
          <button @click="nextStep" class="w-full md:w-auto bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-display font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-amber-500/25 group hover:-translate-y-0.5">
            <span>👉 Enter the Vision</span>
            <span class="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <!-- Step 2: "Which best describes you?" -->
        <div v-else-if="currentStep === 2" class="space-y-8 animate-fade-in">
          <div class="space-y-2">
            <h3 class="text-2xl font-display font-bold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Which best describes you?</h3>
            <p class="text-gray-400 text-xs md:text-sm">Select the option that mirrors your current situation to calibrate your guide.</p>
          </div>

          <div class="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="(opt, idx) in segmentOptions" 
              :key="idx"
              @click="selectedSegment = opt"
              :class="[
                'border p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-start gap-4',
                selectedSegment === opt 
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/5' 
                  : 'border-gray-800 bg-slate-950/40 hover:border-gray-700 hover:bg-slate-950/70'
              ]"
            >
              <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                :class="selectedSegment === opt ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-gray-600'">
                <div v-if="selectedSegment === opt" class="w-2.5 h-2.5 bg-slate-950 rounded-full"></div>
              </div>
              <span class="text-sm font-medium text-gray-200" :class="{'text-amber-300': selectedSegment === opt}">{{ opt }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-800">
            <button @click="prevStep" class="text-sm text-gray-400 hover:text-white transition">Back</button>
            <button 
              @click="submitSegmentSelection" 
              :disabled="!selectedSegment"
              class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              👉 Continue
            </button>
          </div>
        </div>

        <!-- Step 3A: Already in NM (Message & Custom Input) -->
        <div v-else-if="currentStep === 3 && isAlreadyInNM" class="space-y-6 animate-fade-in">
          <div class="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
            <h4 class="text-amber-400 font-bold font-display text-lg">Your challenge is not opportunity, it’s strategy and execution.</h4>
            <p class="text-gray-300 text-sm leading-relaxed">
              We help active distributors identify structural failures, duplicate compensation frameworks, and build sustainable mentoring ecosystems that restore momentum in failing lines.
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              What kind of challenges are you experiencing?
            </label>
            <textarea 
              v-model="challengesText"
              rows="4" 
              placeholder="E.g., Lack of duplication, team members quitting, lack of proper training, mentorship issues..."
              class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 transition"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-800">
            <button @click="prevStep" class="text-sm text-gray-400 hover:text-white transition">Back</button>
            <button 
              @click="nextStep"
              class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-lg transition text-sm"
            >
              👉 Get Coaching & Mentorship
            </button>
          </div>
        </div>

        <!-- Step 3B: New / Exploring (Confrontational welcome & Checklist) -->
        <div v-else-if="currentStep === 3 && !isAlreadyInNM" class="space-y-6 animate-fade-in">
          <div class="space-y-4">
            <h4 class="text-xl font-display font-bold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Welcome to Network Marketing Academia.</h4>
            <p class="text-gray-300 text-sm leading-relaxed">
              You are entering a multibillion-dollar global industry where millions around the world are building income, developing leadership, and transforming their financial future through networks and digital systems.
            </p>
            <p class="text-gray-400 text-xs">Before you continue, tell us who you are. Check all that apply:</p>
          </div>

          <div class="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="(subOpt, idx) in listOptions" 
              :key="idx"
              @click="toggleListOption(subOpt)"
              :class="[
                'border p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 text-xs md:text-sm',
                selectedListOptions.includes(subOpt) 
                  ? 'border-amber-400/50 bg-amber-500/5 text-amber-300' 
                  : 'border-gray-800 bg-slate-950/30 hover:border-gray-700'
              ]"
            >
              <input 
                type="checkbox" 
                :checked="selectedListOptions.includes(subOpt)"
                class="rounded border-gray-700 text-amber-500 focus:ring-0 cursor-pointer pointer-events-none" 
              />
              <span>{{ subOpt }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-800">
            <button @click="prevStep" class="text-sm text-gray-400 hover:text-white transition">Back</button>
            <button 
              @click="nextStep"
              class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-lg transition text-sm"
            >
              👉 Proceed
            </button>
          </div>
        </div>

        <!-- Step 4: Personal Details Form -->
        <div v-else-if="currentStep === 4" class="space-y-6 animate-fade-in">
          <div class="space-y-1">
            <h4 class="text-xl font-display font-bold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Personal Information</h4>
            <p class="text-gray-400 text-xs">Enter your details to create your visitor profile and join the ecosystem.</p>
          </div>

          <form @submit.prevent="submitContactDetails" class="space-y-4">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                v-model="form.fullName" 
                required
                placeholder="John Doe"
                class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 transition" 
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                v-model="form.email" 
                required
                placeholder="johndoe@example.com"
                class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 transition" 
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Phone Number (Optional)</label>
              <input 
                type="tel" 
                v-model="form.phone" 
                placeholder="+234..."
                class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 transition" 
              />
            </div>

            <div class="flex items-start gap-3 mt-4">
              <input 
                type="checkbox" 
                id="consent" 
                v-model="form.consent" 
                required
                class="mt-1 rounded border-gray-800 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer" 
              />
              <label for="consent" class="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                By signing up, I agree to receive learning materials, updates, and communications from Network Marketing Academia.
              </label>
            </div>

            <div v-if="errorMessage" class="text-xs text-red-500 font-semibold">{{ errorMessage }}</div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-800">
              <button type="button" @click="prevStep" class="text-sm text-gray-400 hover:text-white transition">Back</button>
              <button 
                type="submit"
                :disabled="submitting || !form.consent"
                class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 text-sm flex items-center gap-2"
              >
                <span>{{ submitting ? 'Processing...' : '👉 ✔ Enter the Academia' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Step 5: Country Dropdown Selection -->
        <div v-else-if="currentStep === 5" class="space-y-6 animate-fade-in">
          <div class="space-y-1">
            <h4 class="text-xl font-display font-bold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Your Location</h4>
            <p class="text-gray-400 text-xs">Select your country to tailor currency pricing models and regional compensation structures.</p>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Select Your Country 🌍</label>
            <select 
              v-model="selectedCountry" 
              class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 transition"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-800">
            <button @click="prevStep" class="text-sm text-gray-400 hover:text-white transition">Back</button>
            <button 
              @click="finishWizard"
              class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-lg transition text-sm"
            >
              👉 Continue
            </button>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-900 bg-slate-950/80 backdrop-blur-md px-6 py-6 text-center text-xs text-gray-500">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Network Marketing Academia. All rights reserved.</p>
        <p class="text-amber-500/60 hover:text-amber-400 cursor-pointer transition">Official Partner: Alliance In Motion Global</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCatalogStore } from '../stores/catalog';
import { useLeadsStore } from '../stores/leads';
import { useChatStore } from '../stores/chat';

const router = useRouter();
const catalogStore = useCatalogStore();
const leadsStore = useLeadsStore();
const chatStore = useChatStore();

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

const segmentOptions = [
  'I am new to network marketing',
  'I am already in network marketing',
  'I am in network marketing but not satisfied and want to switch companies',
  'I am just exploring opportunities',
  'I am tired of depending on one source of income',
  'I am tired of being jobless',
  'I want this business by all means'
];

const listOptions = [
  'Tired of depending on a single income?',
  'Tired of working hard but not progressing financially?',
  'Tired of job uncertainty and rising living costs?',
  'A single mother looking for a flexible way to support your family?',
  'An employee looking for an additional source of income?',
  'Unemployed and searching for an opportunity?',
  'A student exploring future possibilities?',
  'An entrepreneur looking to expand your income streams?'
];

const isAlreadyInNM = computed(() => {
  return selectedSegment.value === 'I am already in network marketing' || 
         selectedSegment.value === 'I am in network marketing but not satisfied and want to switch companies';
});

onMounted(async () => {
  await catalogStore.fetchCountries();
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
    
    // Set visitor identity details in chat store for immediate sync
    localStorage.setItem('chat_visitor_name', form.value.fullName);
    localStorage.setItem('chat_visitor_email', form.value.email);
    localStorage.setItem('chat_visitor_phone', form.value.phone);

    // Initialize chat session so it is pre-warmed
    try {
      await chatStore.initGuestSession(form.value.fullName, form.value.email, form.value.phone);
    } catch (e) {
      console.warn('Silent chat setup warning:', e);
    }

    nextStep();
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Submission failed. Please check your inputs.';
  } finally {
    submitting.value = false;
  }
};

const finishWizard = () => {
  catalogStore.selectCountry(selectedCountry.value);
  router.push('/presentation');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.4);
}
</style>
