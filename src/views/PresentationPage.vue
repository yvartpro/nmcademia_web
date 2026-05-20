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

    <main class="max-w-6xl mx-auto px-6 py-10 space-y-16">
      <!-- Welcome Header -->
      <section class="text-center space-y-4">
        <h2 class="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
          Your Blueprint for <span class="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Financial Freedom</span>
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Welcome, distributor / future entrepreneur. This workspace serves as your definitive guide to understanding Alliance In Motion Global, the compensation structure in {{ selectedCountryName }}, and the core network science.
        </p>
      </section>

      <!-- Video vs Text Toggle Navigation -->
      <section class="space-y-8">
        <div class="flex justify-center">
          <div class="bg-slate-950/80 border border-gray-800 p-1.5 rounded-xl flex gap-1 shadow-inner">
            <button 
              @click="mode = 'video'" 
              :class="[
                'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2',
                mode === 'video' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-bold' 
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              📹 Video Presentation Mode
            </button>
            <button 
              @click="mode = 'text'" 
              :class="[
                'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2',
                mode === 'text' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-bold' 
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              📄 Text Detailed Mode
            </button>
          </div>
        </div>

        <!-- Mode Content Window -->
        <div class="bg-slate-900/30 border border-gray-800/80 rounded-2xl p-6 md:p-10 backdrop-blur-sm min-h-[400px]">
          <!-- Video Mode Content -->
          <div v-if="mode === 'video'" class="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <h3 class="text-2xl font-display font-bold text-center">Alliance In Motion Global - Video Opportunity Guide</h3>
            <div class="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <iframe 
                v-if="videoUrl"
                :src="videoUrl"
                title="AIM Global Presentation Video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full h-full"
              ></iframe>
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                <span>Loading video presentation...</span>
              </div>
            </div>
            <div class="text-center pt-2">
              <p class="text-xs text-gray-400">Watching the video helps you visualise the compensation binary models and products immediately.</p>
            </div>
          </div>

          <!-- Text Mode Content -->
          <div v-else class="space-y-12 animate-fade-in">
            <!-- Part 1: Company Profile -->
            <div class="space-y-6">
              <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                Part 1: The Platform
              </span>
              <h3 class="text-3xl font-display font-bold">Alliance In Motion Global (AIM Global)</h3>
              <p class="text-gray-300 text-sm md:text-base leading-relaxed">
                Alliance In Motion Global is a leading direct selling and network marketing company registered in the Philippines. For over a decade, it has empowered thousands of distributors globally by distributing premium nutritional and health supplements manufactured by top-tier biotechnology partners in the USA and Europe.
              </p>
              
              <!-- Founders Grid -->
              <div class="mt-8 space-y-4">
                <h4 class="text-lg font-bold text-gray-200">Our Visionary Founders</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-slate-950/40 border border-gray-800/80 p-5 rounded-xl text-center space-y-2">
                    <div class="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto text-amber-400 font-bold border border-amber-400/30">
                      Dr. EC
                    </div>
                    <h5 class="font-bold text-sm">Dr. Ed Cabantog</h5>
                    <p class="text-xs text-amber-500 font-medium">President & CEO</p>
                    <p class="text-gray-400 text-[11px] leading-relaxed">Dr. Ed Cabantog provides health guidance and leads expansion strategies globally.</p>
                  </div>
                  <div class="bg-slate-950/40 border border-gray-800/80 p-5 rounded-xl text-center space-y-2">
                    <div class="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto text-amber-400 font-bold border border-amber-400/30">
                      Eng. FM
                    </div>
                    <h5 class="font-bold text-sm">Engr. Francis Miguel</h5>
                    <p class="text-xs text-amber-500 font-medium">Chief Finance Officer</p>
                    <p class="text-gray-400 text-[11px] leading-relaxed">Pioneering the corporate finance systems ensuring safe, fast commission payouts.</p>
                  </div>
                  <div class="bg-slate-950/40 border border-gray-800/80 p-5 rounded-xl text-center space-y-2">
                    <div class="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto text-amber-400 font-bold border border-amber-400/30">
                      Mr. JA
                    </div>
                    <h5 class="font-bold text-sm">John Asperin</h5>
                    <p class="text-xs text-amber-500 font-medium">Chief Marketing Officer</p>
                    <p class="text-gray-400 text-[11px] leading-relaxed">Crafting marketing strategies and distribution pathways that engage millions.</p>
                  </div>
                </div>
              </div>

              <!-- Manufacturing Partners -->
              <div class="mt-8 space-y-4">
                <h4 class="text-lg font-bold text-gray-200">Global Biotech Manufacturing Partners</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-slate-950/20 border border-gray-900 p-5 rounded-xl flex items-center gap-4">
                    <div class="w-10 h-10 rounded bg-slate-900 flex items-center justify-center shrink-0 border border-gray-800 text-amber-400 font-semibold text-xs">
                      NW
                    </div>
                    <div>
                      <h5 class="font-bold text-xs">Nature's Way (USA)</h5>
                      <p class="text-[11px] text-gray-400">Nutraceutical research & herbal production expertise.</p>
                    </div>
                  </div>
                  <div class="bg-slate-950/20 border border-gray-900 p-5 rounded-xl flex items-center gap-4">
                    <div class="w-10 h-10 rounded bg-slate-900 flex items-center justify-center shrink-0 border border-gray-800 text-amber-400 font-semibold text-xs">
                      DSM
                    </div>
                    <div>
                      <h5 class="font-bold text-xs">DSM (Europe)</h5>
                      <p class="text-[11px] text-gray-400">Science-based nutrition & lipid supplement solutions.</p>
                    </div>
                  </div>
                  <div class="bg-slate-950/20 border border-gray-900 p-5 rounded-xl flex items-center gap-4">
                    <div class="w-10 h-10 rounded bg-slate-900 flex items-center justify-center shrink-0 border border-gray-800 text-amber-400 font-semibold text-xs">
                      WD
                    </div>
                    <div>
                      <h5 class="font-bold text-xs">Weider (USA)</h5>
                      <p class="text-[11px] text-gray-400">Active nutrition & sports medicine manufacturing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Cashflow Quadrant -->
      <section class="space-y-8">
        <div class="text-center space-y-2">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Part 2: The Logic of Wealth
          </span>
          <h3 class="text-3xl font-display font-bold">The Cashflow Quadrant</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm">
            Developed by Robert Kiyosaki, the quadrant divides income earners into four segments. Select a quadrant below to see details.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900/25 border border-gray-800 rounded-2xl p-6 md:p-8">
          
          <!-- Interactive SVG/Grid Quadrant Map -->
          <div class="aspect-square w-full max-w-[380px] mx-auto grid grid-cols-2 gap-3 p-3 bg-slate-950 border border-gray-850 rounded-xl relative">
            <div 
              @click="activeQuadrant = 'E'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'E' 
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/60" :class="{'text-amber-400': activeQuadrant === 'E'}">E</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Employee</span>
            </div>
            
            <div 
              @click="activeQuadrant = 'B'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'B' 
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/60" :class="{'text-amber-400': activeQuadrant === 'B'}">B</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Business Owner</span>
            </div>

            <div 
              @click="activeQuadrant = 'S'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'S' 
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/60" :class="{'text-amber-400': activeQuadrant === 'S'}">S</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Self Employed</span>
            </div>

            <div 
              @click="activeQuadrant = 'I'"
              :class="[
                'rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4 relative overflow-hidden',
                activeQuadrant === 'I' 
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-white' 
                  : 'bg-slate-900/60 border border-gray-850 text-gray-400 hover:bg-slate-900 hover:text-gray-200'
              ]"
            >
              <span class="text-4xl md:text-5xl font-display font-black text-amber-500/60" :class="{'text-amber-400': activeQuadrant === 'I'}">I</span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Investor</span>
            </div>

            <!-- Absolute Center Indicator -->
            <div class="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#0b0f19] border border-gray-800 flex items-center justify-center pointer-events-none text-[8px] font-bold text-gray-500 shadow-inner shadow-slate-950">
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
              <span class="text-xs text-amber-500 uppercase font-semibold tracking-wider">Leverage Rating:</span>
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

      <!-- Ways of Earning & Pricing Models -->
      <section class="space-y-8">
        <div class="text-center space-y-2">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Part 3: Compensation
          </span>
          <h3 class="text-3xl font-display font-bold">The Hybrid Compensation Plan</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm">
            Discover the direct and residual payout mechanisms active in {{ selectedCountryName }}.
          </p>
        </div>

        <!-- Packages Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="pkg in catalogStore.packages" 
            :key="pkg.id"
            :class="[
              'border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative',
              pkg.featured 
                ? 'border-amber-400 bg-amber-500/5 shadow-xl shadow-amber-500/5 -translate-y-1' 
                : 'border-gray-800 bg-slate-950/40 hover:border-gray-700'
            ]"
          >
            <div v-if="pkg.featured" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow">
              Most Popular
            </div>

            <div class="space-y-4">
              <h4 class="text-lg font-display font-extrabold">{{ pkg.name }}</h4>
              <p class="text-gray-400 text-xs font-light leading-relaxed">{{ pkg.description }}</p>
              
              <!-- Dynamic Price Display -->
              <div class="py-4 border-y border-gray-800/80 my-4 space-y-1">
                <span class="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Entry Price</span>
                <span class="text-2xl font-display font-extrabold text-amber-400">
                  {{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}
                </span>
              </div>

              <!-- Payout Rules -->
              <div class="space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-400">Direct Referral Bonus:</span>
                  <span class="text-emerald-400 font-bold font-display">
                    +{{ currencySymbol }}{{ getPriceForCountry(pkg, 'referralBonus') }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-400">Matched Sales (Pairing):</span>
                  <span class="text-amber-400 font-bold font-display">
                    {{ currencySymbol }}{{ getPriceForCountry(pkg, 'matchBonus') }}
                  </span>
                </div>
              </div>
            </div>

            <button 
              @click="consultTrainerPackage(pkg)" 
              class="w-full mt-6 bg-slate-900 border border-gray-800 hover:border-amber-400 hover:bg-slate-950 text-white text-xs font-semibold py-2.5 rounded-lg transition"
            >
              Order & Register Package
            </button>
          </div>
        </div>

        <!-- Payout Plan details -->
        <div class="bg-slate-900/30 border border-gray-800 rounded-xl p-6 space-y-6">
          <h4 class="text-lg font-bold font-display text-gray-200">How the Pairing Bonus Works:</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed font-light">
              <p>
                AIM Global uses a <strong class="text-amber-400 font-semibold">Binary Network System</strong>. When you register, you get a tracking center with a <strong class="text-gray-200 font-medium">Left Group</strong> and a <strong class="text-gray-200 font-medium">Right Group</strong>.
              </p>
              <ul class="space-y-2 list-disc list-inside">
                <li>Register a distributor on your left: you receive Direct Referral Commission.</li>
                <li>Register a distributor on your right: you receive Direct Referral Commission.</li>
                <li>The system detects <span class="text-emerald-400">1 person left + 1 person right</span>, matches them, and issues a <strong class="text-amber-400">Matched Sales Bonus of {{ currencySymbol }}{{ matchBonusText }}</strong> automatically!</li>
              </ul>
              <p class="text-xs text-gray-400">
                This process duplicates downwards infinitely. Even if you didn't refer the people, as long as new registrations match on your left and right groups, you continue earning pairing bonuses!
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
                  <div class="w-10 h-10 rounded-full bg-slate-900 border border-gray-800 text-white flex items-center justify-center text-xs">Left</div>
                  <span class="text-[10px] text-emerald-400 font-bold mt-1">Direct Ref</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-slate-900 border border-gray-800 text-white flex items-center justify-center text-xs">Right</div>
                  <span class="text-[10px] text-emerald-400 font-bold mt-1">Direct Ref</span>
                </div>
              </div>
              <div class="w-full border-t border-dashed border-gray-800 pt-3 text-center">
                <span class="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
                  Matched Sale Pair: +{{ currencySymbol }}{{ matchBonusText }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="space-y-8">
        <div class="text-center space-y-2">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Part 4: Catalog
          </span>
          <h3 class="text-3xl font-display font-bold">Scientific Health Products</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm">
            Alliance In Motion Global distribution relies on highly validated daily food supplement items.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="prod in catalogStore.products" 
            :key="prod.id"
            class="bg-slate-950/40 border border-gray-850 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-300"
          >
            <div class="space-y-3">
              <!-- Placeholder Image box -->
              <div class="aspect-square w-full rounded bg-slate-900 flex items-center justify-center overflow-hidden border border-gray-900 relative">
                <div class="text-center space-y-2">
                  <span class="text-3xl">💊</span>
                  <span class="text-[10px] text-gray-500 block uppercase font-mono">{{ prod.category }}</span>
                </div>
              </div>

              <div>
                <h4 class="font-bold text-base text-gray-200">{{ prod.name }}</h4>
                <p class="text-[11px] text-amber-500 italic mt-0.5">{{ prod.scientificName }}</p>
              </div>
              <p class="text-xs text-gray-400 font-light leading-relaxed">{{ prod.description }}</p>
            </div>
            
            <div class="flex items-center justify-between border-t border-gray-850 pt-4 mt-4">
              <span class="text-sm font-display font-extrabold text-amber-400">
                {{ currencySymbol }}{{ formatNumber(prod.price * conversionRate) }}
              </span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest font-bold bg-slate-950 border border-gray-850 px-2 py-0.5 rounded">
                AIM Global original
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQs Section -->
      <section class="space-y-8">
        <div class="text-center space-y-2">
          <span class="text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Part 5: FAQs
          </span>
          <h3 class="text-3xl font-display font-bold">Frequently Asked Questions</h3>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm">
            Read comprehensive responses resolving common objections and clarifying the network strategy.
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
            <!-- Accordion Header -->
            <button 
              @click="toggleFAQ(faq.id)" 
              class="w-full flex items-center justify-between p-5 text-left text-sm font-semibold hover:bg-slate-950/40 transition gap-4"
            >
              <span :class="{'text-amber-400': openFAQs.includes(faq.id)}">{{ faq.question }}</span>
              <span class="text-amber-400 transition-transform duration-300" :class="{'rotate-180': openFAQs.includes(faq.id)}">
                ▼
              </span>
            </button>

            <!-- Accordion Panel -->
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

      <!-- Trainer Call To Action -->
      <section class="bg-gradient-to-tr from-amber-500/10 via-yellow-400/5 to-transparent border border-amber-500/25 rounded-2xl p-8 md:p-10 text-center space-y-6">
        <h3 class="text-2xl md:text-3xl font-display font-extrabold">Ready to begin your transition?</h3>
        <p class="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
          Contact our team trainer directly on WhatsApp for regional training locations, product pickups, and system guidelines.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            :href="whatsappLink"
            target="_blank" 
            class="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition"
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
import api from '../api';

const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();

const mode = ref('video');
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
    fetchFAQs()
  ]);
  // Sync selected country with local storage if not loaded
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

const matchBonusText = computed(() => {
  // Find a package's matchBonus in prices
  if (catalogStore.packages.length > 0) {
    const pkg = catalogStore.packages[0];
    const priceObj = pkg.prices?.find(p => p.countryCode === selectedCountryCode.value);
    if (priceObj) return formatNumber(priceObj.matchBonus);
  }
  return selectedCountryCode.value === 'NG' ? '7,000' : '5';
});

const videoUrl = computed(() => {
  return settingsStore.settings['video_url'] || 'https://www.youtube.com/embed/zpOULjyy-n8';
});

const whatsappLink = computed(() => {
  const number = catalogStore.selectedCountry?.whatsappNumber || settingsStore.settings['whatsapp_number'] || '+2348030001111';
  return `https://wa.me/${number.replace(/\+/g, '')}`;
});

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
  const text = encodeURIComponent(`Hello Trainer, I am interested in registering for the ${pkg.name} (${currencySymbol}${getPriceForCountry(pkg, 'price')}) in ${selectedCountryName.value}. Please guide me on registration.`);
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
