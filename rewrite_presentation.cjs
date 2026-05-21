const fs = require('fs');

const content = fs.readFileSync('src/views/PresentationPage.vue', 'utf8');

// Extract script
const scriptMatch = content.match(/<script setup>([\s\S]*?)<\/script>/);
let script = scriptMatch ? scriptMatch[1] : '';

// Add useThemeStore if not present
if (!script.includes('useThemeStore')) {
  script = script.replace(/import \{ ref, onMounted, computed \} from 'vue';/, "import { ref, onMounted, computed } from 'vue';\nimport { useThemeStore } from '../stores/theme';");
  script = script.replace(/const settingsStore = useSettingsStore\(\);/, "const settingsStore = useSettingsStore();\nconst themeStore = useThemeStore();\n\nconst currentSlide = ref(1);\nconst totalSlides = 8;\n\nconst nextSlide = () => { if (currentSlide.value < totalSlides) currentSlide.value++; window.scrollTo({ top: 0, behavior: 'smooth' }); };\nconst prevSlide = () => { if (currentSlide.value > 1) currentSlide.value--; window.scrollTo({ top: 0, behavior: 'smooth' }); };\n\nconst openFAQs = ref([]);\nconst searchQuery = ref('');\nconst rawFAQs = ref([]);");
}

const template = `<template>
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
                <img v-if="founder.photo" :src="founder.photo.filePath" :alt="founder.name" class="w-full h-full object-cover" />
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
                <img v-if="partner.logo" :src="partner.logo.filePath" :alt="partner.name" class="w-full h-full object-contain grayscale opacity-70" />
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
               <img v-if="product.image" :src="product.image.filePath" :alt="product.name" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
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
                <img v-if="test.photo" :src="test.photo.filePath" :alt="test.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">"{{ test.quote }}"</p>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white">{{ test.name }}</h4>
                <div class="flex gap-2 mt-1 flex-wrap">
                  <span class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{{ test.lifestyleTag1 }}</span>
                  <span v-if="test.lifestyleTag2" class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{{ test.lifestyleTag2 }}</span>
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
        
        <div class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
          <div v-for="faq in filteredFAQsList.slice(0, 10)" :key="faq.id" class="border-b border-gray-200 dark:border-gray-800 last:border-0">
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
</template>`;

const finalContent = `${template}\n\n<script setup>\n${script}\n</script>\n\n<style scoped>\n.animate-fade-in {\n  animation: fadeIn 0.3s ease-out forwards;\n}\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(10px); }\n  to { opacity: 1; transform: translateY(0); }\n}\nselect option {\n  background-color: #fff;\n  color: #000;\n}\n.dark select option {\n  background-color: #1a1a1a;\n  color: #fff;\n}\n</style>\n`;

fs.writeFileSync('src/views/PresentationPage.vue', finalContent);
console.log('Successfully rewrote PresentationPage.vue');
