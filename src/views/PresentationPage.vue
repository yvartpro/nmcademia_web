<template>
  <div class="min-h-screen bg-[#0b0f19] text-white font-sans relative pb-24">
    <!-- Glow Effects -->
    <div class="absolute top-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-1/2 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Header Navigation -->
    <header class="border-b border-gray-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-900 text-base shadow-lg">
            NMA
          </div>
          <div>
            <h1 class="font-display font-bold text-md tracking-wide">Network Marketing Academia</h1>
            <p class="text-[9px] text-amber-400 tracking-wider">GUIDE & OPPORTUNITY WORKSPACE</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Country Switcher -->
          <div class="flex items-center gap-2 bg-slate-950/60 border border-gray-800 rounded-full px-3 py-1.5">
            <span class="text-xs text-gray-400">Region:</span>
            <select 
              v-model="selectedCountryCode" 
              @change="changeCountry"
              class="bg-transparent text-xs text-amber-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code" class="bg-slate-900 text-white">
                {{ c.name }} ({{ c.currencySymbol }})
              </option>
            </select>
          </div>

          <router-link to="/" class="text-xs text-gray-400 hover:text-white transition">
            Restart Wizard
          </router-link>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10 space-y-20">
      <!-- 1. PARTNER SECTION (OUR PARTNER COMPANY) -->
      <section class="space-y-6 bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-900/20 border border-amber-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="space-y-4 max-w-3xl">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Partner Company
          </span>
          <h2 class="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            {{ settings['partner_company_name'] || 'Alliance In Motion Global Group of Companies' }}
          </h2>
          <p class="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {{ settings['partner_company_intro'] }}
          </p>
        </div>
      </section>

      <!-- 2. COMPANY PROFILE -->
      <section class="space-y-10">
        <div class="space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Company Profile
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">About Alliance In Motion Global (AGG)</h3>
          <p class="text-gray-455 text-sm md:text-base leading-relaxed whitespace-pre-line max-w-4xl">
            {{ settings['partner_company_profile'] }}
          </p>
        </div>

        <!-- Visionary Founders -->
        <div class="space-y-6 pt-4">
          <h4 class="text-lg font-bold font-display text-amber-300">Visionary Founders</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="founder in founders" 
              :key="founder.id" 
              class="bg-slate-900/40 border border-gray-800/80 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/30 hover:-translate-y-1"
            >
              <div class="space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center">
                  <img 
                    v-if="founder.photo" 
                    :src="founder.photo.filePath" 
                    :alt="founder.name" 
                    class="w-full h-full object-cover rounded-2xl" 
                  />
                  <div v-else class="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-lg">
                    {{ founder.initials || founder.name.split(' ').map(n=>n[0]).join('') }}
                  </div>
                </div>
                <div>
                  <h5 class="font-bold text-base text-gray-200">{{ founder.name }}</h5>
                  <p class="text-xs text-amber-500 font-medium font-mono uppercase tracking-wider">{{ founder.role }}</p>
                </div>
                <p class="text-gray-400 text-xs leading-relaxed font-light">{{ founder.bio }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Manufacturing Partners -->
        <div class="space-y-6 pt-6">
          <h4 class="text-lg font-bold font-display text-amber-300">Global Biotech Manufacturing Partners</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div 
              v-for="partner in manufacturingPartners" 
              :key="partner.id"
              class="bg-slate-950/40 border border-gray-900 p-5 rounded-xl flex flex-col justify-between hover:border-gray-800 transition"
            >
              <div class="space-y-3">
                <div class="w-10 h-10 rounded-lg bg-slate-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="partner.logo" 
                    :src="partner.logo.filePath" 
                    :alt="partner.name" 
                    class="w-full h-full object-contain" 
                  />
                  <span v-else class="text-amber-500 font-bold text-xs uppercase">{{ partner.name.substring(0, 2) }}</span>
                </div>
                <div>
                  <h5 class="font-bold text-xs text-gray-200">{{ partner.name }}</h5>
                  <span class="text-[10px] text-gray-500 font-medium font-mono">{{ partner.country }}</span>
                </div>
                <p class="text-[11px] text-gray-400 leading-normal font-light">{{ partner.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. OUR PRODUCTS -->
      <section class="space-y-10">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Our Products
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">Scientific & Validated Health Solutions</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Every product distributed through AGG undergoes rigorous biotech verification. Check the product presentation video below and explore our standard catalog items.
          </p>
        </div>

        <!-- Video Player -->
        <div class="aspect-video w-full max-w-4xl mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
          <iframe 
            v-if="settings['video_url']"
            :src="settings['video_url']"
            title="AGG Products Presentation Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <span>Loading video presentation...</span>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="prod in catalogStore.products" 
            :key="prod.id"
            class="bg-slate-950/40 border border-gray-900 hover:border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between transition-all duration-350 hover:-translate-y-0.5"
          >
            <div class="space-y-4">
              <div class="aspect-square w-full rounded-xl bg-slate-900/60 flex items-center justify-center overflow-hidden border border-gray-900 relative">
                <img 
                  v-if="prod.image" 
                  :src="prod.image.filePath" 
                  :alt="prod.name" 
                  class="w-full h-full object-cover" 
                />
                <div v-else class="text-center space-y-2">
                  <span class="text-3xl">💊</span>
                  <span class="text-[9px] text-gray-500 block uppercase font-mono tracking-wider">{{ prod.category }}</span>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-base text-gray-200">{{ prod.name }}</h4>
                <p class="text-xs text-amber-500 italic mt-0.5">{{ prod.scientificName }}</p>
              </div>
              <p class="text-xs text-gray-400 font-light leading-relaxed">{{ prod.description }}</p>
            </div>
            
            <div class="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-5">
              <span class="text-sm font-display font-extrabold text-amber-400">
                {{ currencySymbol }}{{ formatNumber(prod.price * conversionRate) }}
              </span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest font-bold bg-slate-950 border border-gray-850 px-2 py-0.5 rounded">
                AGG Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. WHAT IS YOUR DREAM? & TESTIMONIALS -->
      <section class="space-y-10">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            The Vision
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">What is Your Dream?</h3>
          <p class="text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed whitespace-pre-line">
            {{ settings['dream_section_text'] }}
          </p>
        </div>

        <!-- Testimonials Slideshow/Grid -->
        <div class="space-y-6 pt-4">
          <h4 class="text-center text-lg font-bold font-display text-amber-300">Transformational Journeys</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="t in testimonials" 
              :key="t.id"
              class="bg-slate-900/35 border border-gray-850 p-6 rounded-2xl flex flex-col justify-between relative hover:border-gray-750 transition duration-300"
            >
              <span class="absolute top-4 right-6 text-4xl text-amber-500/10 font-serif">“</span>
              <div class="space-y-4">
                <p class="text-xs text-gray-300 leading-relaxed font-light italic">
                  {{ t.quote }}
                </p>
              </div>
              <div class="flex items-center gap-3 border-t border-gray-800/50 pt-4 mt-4">
                <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-400 text-sm overflow-hidden shrink-0 border border-amber-500/20">
                  <img v-if="t.photo" :src="t.photo.filePath" :alt="t.name" class="w-full h-full object-cover" />
                  <span v-else>{{ t.name.split(' ').map(n=>n[0]).join('') }}</span>
                </div>
                <div>
                  <h5 class="font-bold text-xs text-gray-200">{{ t.name }}</h5>
                  <span class="text-[10px] text-amber-500 font-mono tracking-wider">{{ t.lifestyleTag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. THE CASHFLOW QUADRANT -->
      <section class="space-y-10">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Part 2: The Logic of Wealth
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">The Cashflow Quadrant</h3>
          <p class="text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed whitespace-pre-line">
            {{ settings['cashflow_quadrant_explanation'] || 'The Cashflow Quadrant, created by Robert Kiyosaki, describes the four distinct systems through which income is generated.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900/25 border border-gray-800/80 rounded-3xl p-6 md:p-8">
          <!-- Interactive SVG/Grid Quadrant Map -->
          <div class="aspect-square w-full max-w-[380px] mx-auto grid grid-cols-2 gap-3 p-3 bg-slate-950 border border-gray-850 rounded-xl relative">
            <div 
              @click="activeQuadrant = 'E'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'E' 
                  ? 'bg-amber-500/20 border border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/40" :class="{'text-amber-400': activeQuadrant === 'E'}">E</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Employee</span>
            </div>
            
            <div 
              @click="activeQuadrant = 'B'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'B' 
                  ? 'bg-amber-500/20 border border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/40" :class="{'text-amber-400': activeQuadrant === 'B'}">B</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Business Owner</span>
            </div>

            <div 
              @click="activeQuadrant = 'S'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'S' 
                  ? 'bg-amber-500/20 border border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/40" :class="{'text-amber-400': activeQuadrant === 'S'}">S</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Self Employed</span>
            </div>

            <div 
              @click="activeQuadrant = 'I'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'I' 
                  ? 'bg-amber-500/20 border border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/40" :class="{'text-amber-400': activeQuadrant === 'I'}">I</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Investor</span>
            </div>

            <div class="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#0b0f19] border border-gray-800 flex items-center justify-center pointer-events-none text-[8px] font-bold text-gray-500 shadow-inner">
              NMA
            </div>
          </div>

          <!-- Quadrant Descriptions Panel -->
          <div class="space-y-4">
            <h4 class="text-xl font-display font-bold text-amber-400">
              {{ quadrantData[activeQuadrant].title }}
            </h4>
            <p class="text-gray-300 text-sm md:text-base leading-relaxed">
              {{ quadrantData[activeQuadrant].description }}
            </p>
            <div class="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
              <span class="text-xs text-amber-500 uppercase font-semibold tracking-wider font-mono">Leverage Rating:</span>
              <p class="text-xs text-gray-400 font-light">
                {{ quadrantData[activeQuadrant].leverage }}
              </p>
            </div>
            
            <div class="pt-2" v-if="activeQuadrant === 'E' || activeQuadrant === 'S'">
              <button @click="activeQuadrant = 'B'" class="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                See how Network Marketing helps you migrate to B-Quadrant →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. WAYS OF EARNING -->
      <section class="space-y-12">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Compensation
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">The Hybrid Compensation Plan</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            AGG distributes commissions through multiple distinct compensation mechanisms designed to pay immediate, intermediate, and residual royalties.
          </p>
        </div>

        <!-- Earning Streams List/Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="stream in earningStreams" 
            :key="stream.id"
            class="bg-slate-950/30 border border-gray-900 p-6 rounded-2xl flex flex-col justify-between hover:border-gray-800 transition duration-300"
          >
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ stream.icon }}</span>
                <h4 class="font-bold text-base text-amber-400 font-display">{{ stream.title }}</h4>
              </div>
              <p class="text-xs text-gray-300 font-semibold leading-relaxed">{{ stream.shortDescription }}</p>
              <p class="text-xs text-gray-400 font-light leading-relaxed">{{ stream.longDescription }}</p>
            </div>
          </div>
        </div>

        <!-- Binary Match Explainer Card -->
        <div class="bg-slate-900/30 border border-gray-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <h4 class="text-lg font-bold font-display text-gray-200">How the Binary Pairing System Works:</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed font-light">
              <p class="whitespace-pre-line">
                {{ settings['binary_system_explanation'] }}
              </p>
            </div>

            <!-- Visual representation of binary tree -->
            <div class="bg-slate-950 border border-gray-850 p-6 rounded-xl flex flex-col items-center justify-center space-y-4">
              <div class="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow text-xs">You</div>
              <div class="h-6 w-0.5 bg-gray-800"></div>
              <div class="flex gap-16 relative">
                <!-- Diagonal Left connection -->
                <div class="absolute top-0 left-6 w-10 h-0.5 bg-gray-800 transform -rotate-12"></div>
                <!-- Diagonal Right connection -->
                <div class="absolute top-0 right-6 w-10 h-0.5 bg-gray-800 transform rotate-12"></div>

                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-slate-900 border border-gray-850 text-white flex items-center justify-center text-xs">Left</div>
                  <span class="text-[10px] text-emerald-400 font-bold mt-1 font-mono">DRB</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-slate-900 border border-gray-850 text-white flex items-center justify-center text-xs">Right</div>
                  <span class="text-[10px] text-emerald-400 font-bold mt-1 font-mono">DRB</span>
                </div>
              </div>
              <div class="w-full border-t border-dashed border-gray-800 pt-3 text-center">
                <span class="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
                  Matched Sale Pair Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. HOW TO JOIN (NIGERIA PACKAGES) -->
      <section class="space-y-8 bg-slate-900/15 border border-gray-900 rounded-3xl p-6 md:p-10">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Pioneer Opportunity
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">How To Join (Nigeria Office & International Shipping)</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Explore active starter package packages configured for our primary regional hub in Nigeria. If you are ordering from outside Nigeria, consult our delivery notes below.
          </p>
        </div>

        <!-- Packages Table -->
        <div class="overflow-x-auto rounded-xl border border-gray-800/80 bg-slate-950/40">
          <table class="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr class="border-b border-gray-800 bg-slate-900/60 font-semibold text-amber-400 font-display">
                <th class="p-4">Package Type</th>
                <th class="p-4">Entry Cost (NGN)</th>
                <th class="p-4">Direct Referral (NGN)</th>
                <th class="p-4">Matched Pairing (NGN)</th>
                <th class="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="pkg in nigeriaPackages" 
                :key="pkg.id"
                class="border-b border-gray-850/60 hover:bg-slate-900/10 transition"
              >
                <td class="p-4 font-bold">{{ pkg.name }}</td>
                <td class="p-4 text-amber-400 font-extrabold font-mono">₦{{ formatNumber(pkg.ngPrice) }}</td>
                <td class="p-4 text-emerald-400 font-bold font-mono">₦{{ formatNumber(pkg.ngReferralBonus) }}</td>
                <td class="p-4 text-yellow-450 font-bold font-mono">₦{{ formatNumber(pkg.ngMatchBonus) }}</td>
                <td class="p-4 text-center">
                  <button 
                    @click="consultTrainerPackage(pkg)" 
                    class="bg-slate-900 hover:bg-slate-950 border border-gray-800 text-xs px-4 py-1.5 rounded-lg transition"
                  >
                    Select
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-xs text-gray-500 font-light leading-relaxed whitespace-pre-line border-t border-gray-850 pt-6">
          {{ settings['how_to_join_note'] }}
        </p>
      </section>

      <!-- 8. FAQs -->
      <section class="space-y-8">
        <div class="text-center space-y-4">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Support
          </span>
          <h3 class="text-2xl md:text-3xl font-display font-bold">Frequently Asked Questions</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Read through curated answers resolving common inquiries and objections about the platform.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-md mx-auto">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="filterFAQs"
            placeholder="Search questions or objections..." 
            class="w-full bg-slate-950 border border-gray-800 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-amber-400 transition shadow-inner"
          />
        </div>

        <!-- FAQs Accordions -->
        <div class="max-w-3xl mx-auto space-y-3">
          <div 
            v-for="faq in filteredFAQsList" 
            :key="faq.id"
            class="border border-gray-850 rounded-xl overflow-hidden bg-slate-950/20 transition-all duration-300"
          >
            <button 
              @click="toggleFAQ(faq.id)" 
              class="w-full flex items-center justify-between p-5 text-left text-sm font-semibold hover:bg-slate-950/40 transition gap-4"
            >
              <span :class="{'text-amber-400': openFAQs.includes(faq.id)}">{{ faq.question }}</span>
              <span class="text-amber-400 transition-transform duration-300" :class="{'rotate-180': openFAQs.includes(faq.id)}">
                ▼
              </span>
            </button>

            <div 
              v-show="openFAQs.includes(faq.id)" 
              class="p-5 bg-slate-950/60 border-t border-gray-850 text-xs md:text-sm text-gray-300 leading-relaxed font-light whitespace-pre-line"
            >
              {{ faq.answer }}
            </div>
          </div>
          <div v-if="filteredFAQsList.length === 0" class="text-center text-gray-500 py-8 text-xs">
            No matching questions or objections found. Use the chat widget below to consult the trainer.
          </div>
        </div>
      </section>

      <!-- 9. CTA / WhatsApp Section -->
      <section class="bg-gradient-to-tr from-amber-500/10 via-yellow-400/5 to-transparent border border-amber-500/25 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h3 class="text-2xl md:text-3xl font-display font-extrabold">Ready to begin your transition?</h3>
        <p class="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
          Contact our team trainer directly on WhatsApp for regional training locations, product pickups, and registration support.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            :href="whatsappLink"
            target="_blank" 
            class="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <span>💬 Chat Trainer on WhatsApp</span>
          </a>
        </div>
      </section>
    </main>

    <!-- Floating Chat Widget will go here -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useContentStore } from '../stores/content';
import api from '../api';

const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
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
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

select option {
  background-color: #0f172a !important;
  color: #fff !important;
}
</style>
