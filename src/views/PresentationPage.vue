<template>
  <div class="min-h-screen bg-surface-0 pb-28 nma-gradient-mesh font-sans">
    
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <AppLogo size="sm" />
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-zinc-200">
            <Globe :size="14" class="text-zinc-400" />
            <select
              v-model="selectedCountryCode"
              @change="changeCountry"
              class="bg-transparent text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
            >
              <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                {{ c.code }} ({{ c.currencySymbol }})
              </option>
            </select>
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
        <UiButton
          v-if="memberStore.canFeature('courses')"
          variant="outline"
          size="sm"
          to="/app/training"
          class="shrink-0"
        >
          Go to Training Curriculum
        </UiButton>
      </div>
    </div>

    <!-- Presentation Main Viewport -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      <!-- Slide 1: Company Profile -->
      <div v-if="currentSlide === 1" class="motion-safe:animate-fade-in space-y-8">
        <div class="space-y-4">
          <h2 class="text-3xl sm:text-4xl font-display font-black leading-tight text-zinc-950">
            {{ settings['partner_company_name'] || 'Alliance In Motion Global Group of Companies' }}
          </h2>
          <p class="text-sm text-zinc-500 font-semibold tracking-wide">ESTABLISHED SINCE 2006 • OVER 40+ COUNTRIES</p>
        </div>
        
        <div class="nma-card p-6 leading-relaxed text-zinc-650 whitespace-pre-line text-sm sm:text-base border-accent/20">
          {{ settings['partner_company_intro'] }}
        </div>
      </div>

      <!-- Slide 2: Founders & Partners -->
      <div v-if="currentSlide === 2" class="motion-safe:animate-fade-in space-y-10">
        <div class="space-y-2">
          <h2 class="text-2xl sm:text-3xl font-display font-black">Visionary Founders</h2>
          <p class="text-xs text-zinc-500 whitespace-pre-line">{{ settings['partner_company_profile'] }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div v-for="founder in founders" :key="founder.id" class="nma-card p-5 space-y-4 hover:border-accent transition-all duration-300">
            <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-zinc-200 shrink-0">
              <img v-if="founder.photo" :src="getFullMediaUrl(founder.photo)" :alt="founder.name" class="w-full h-full object-cover" />
              <span v-else class="text-zinc-500 font-bold text-lg">{{ founder.name.split(' ').map(n=>n[0]).join('') }}</span>
            </div>
            <div>
              <h4 class="font-extrabold text-sm text-zinc-900">{{ founder.name }}</h4>
              <p class="text-[10px] text-accent font-bold uppercase tracking-wider">{{ founder.role }}</p>
            </div>
            <p class="text-xs text-zinc-500 leading-relaxed font-light">{{ founder.bio }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-bold font-display">Global Manufacturing Partners</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="partner in partners" :key="partner.id" class="p-5 bg-white border border-zinc-200 hover:border-accent rounded-xl flex items-center gap-4 transition">
              <div class="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center border border-zinc-200 shrink-0">
                <img v-if="partner.logo" :src="getFullMediaUrl(partner.logo)" :alt="partner.name" class="w-full h-full object-contain" />
                <span v-else class="text-slate-800 font-bold text-xs">{{ partner.name.substring(0, 3) }}</span>
              </div>
              <div>
                <h5 class="font-bold text-sm">{{ partner.name }}</h5>
                <p class="text-[10px] text-zinc-500">{{ partner.country }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3: Products Catalog -->
      <div v-if="currentSlide === 3" class="motion-safe:animate-fade-in space-y-8">
        <h2 class="text-2xl sm:text-3xl font-display font-black">World-Class Health & Wellness</h2>
        
        <div class="aspect-video bg-white rounded-2xl overflow-hidden shadow-glow border border-zinc-200">
          <iframe
            v-if="settings['video_url']"
            :src="settings['video_url']"
            title="Presentation Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
            Video presentation goes here
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="product in catalogStore.products" :key="product.id" class="nma-card p-5 flex flex-col items-center text-center hover:border-accent transition duration-300">
            <div class="w-20 h-20 bg-zinc-50 rounded-2xl p-2 border border-zinc-250/20 mb-3 flex items-center justify-center">
              <img v-if="product.image" :src="getFullMediaUrl(product.image)" :alt="product.name" class="w-full h-full object-contain" />
            </div>
            <h4 class="font-extrabold text-sm text-zinc-900">{{ product.name }}</h4>
            <p class="text-xs text-zinc-500 line-clamp-2 mt-2 font-light">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- Slide 4: Success Stories & Dream -->
      <div v-if="currentSlide === 4" class="motion-safe:animate-fade-in space-y-8">
        <div class="space-y-4">
          <h2 class="text-2xl sm:text-3xl font-display font-black">What is Your Dream?</h2>
          <p class="text-sm leading-relaxed text-zinc-650 bg-accent/5 p-6 rounded-xl border border-accent/10">
            {{ settings['dream_section_text'] }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-bold font-display">Testimonials</h3>
          <div class="grid gap-4">
            <div v-for="test in testimonials" :key="test.id" class="nma-card p-5 flex flex-col sm:flex-row gap-4 items-start">
              <div class="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-bold text-sm">
                {{ test.name.split(' ').map(n=>n[0]).join('') }}
              </div>
              <div class="space-y-2">
                <p class="text-sm text-zinc-650 italic">"{{ test.quote }}"</p>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-xs">{{ test.name }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 5: Cashflow Quadrant -->
      <div v-if="currentSlide === 5" class="motion-safe:animate-fade-in space-y-8">
        <div class="space-y-2">
          <h2 class="text-2xl sm:text-3xl font-display font-black">The Cashflow Quadrant</h2>
          <p class="text-xs text-zinc-500 leading-relaxed">{{ settings['cashflow_quadrant_explanation'] }}</p>
        </div>

        <!-- Cashflow Quadrant Interactive Image/Fallback Diagram -->
        <div class="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 bg-white shadow-xl group">
          <!-- 1. Custom Image Mode -->
          <img
            v-if="settings?.['cashflow_quadrant_image']"
            :src="getFullMediaUrl(settings['cashflow_quadrant_image'])"
            alt="Cashflow Quadrant"
            class="w-full h-full object-cover transition-all duration-500"
          />

          <!-- 2. Gorgeous CSS Fallback Mode (If no image uploaded) -->
          <div v-else class="w-full h-full grid grid-cols-2 grid-rows-2 p-4 gap-4 bg-gradient-to-br from-zinc-900 to-indigo-950/40">
            <!-- E sector fallback -->
            <div 
              class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
              :class="activeQuadrant === 'E' ? 'bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
            >
              <span class="text-3xl font-black text-red-500/80">E</span>
              <div>
                <h4 class="text-xs font-extrabold text-zinc-300">Employee</h4>
                <p class="text-[9px] text-zinc-500 mt-0.5">Time for Money</p>
              </div>
            </div>

            <!-- B sector fallback -->
            <div 
              class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
              :class="activeQuadrant === 'B' ? 'bg-accent/10 border-accent/40 ring-1 ring-accent/30' : 'bg-white/[0.02] border-white/[0.05]'"
            >
              <span class="text-3xl font-black text-accent">B</span>
              <div>
                <h4 class="text-xs font-extrabold text-zinc-300">Business Owner</h4>
                <p class="text-[9px] text-zinc-500 mt-0.5">Leverage Systems</p>
              </div>
            </div>

            <!-- S sector fallback -->
            <div 
              class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
              :class="activeQuadrant === 'S' ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
            >
              <span class="text-3xl font-black text-orange-500/80">S</span>
              <div>
                <h4 class="text-xs font-extrabold text-zinc-300">Self-Employed</h4>
                <p class="text-[9px] text-zinc-500 mt-0.5">Own Your Job</p>
              </div>
            </div>

            <!-- I sector fallback -->
            <div 
              class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
              :class="activeQuadrant === 'I' ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
            >
              <span class="text-3xl font-black text-emerald-500/80">I</span>
              <div>
                <h4 class="text-xs font-extrabold text-zinc-300">Investor</h4>
                <p class="text-[9px] text-zinc-500 mt-0.5">Money Works for You</p>
              </div>
            </div>
          </div>

          <!-- 3. Absolute Clickable Interactive Hotspots (Works for both Image & Fallback modes) -->
          <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 gap-2">
            <!-- Top Left: E -->
            <button
              type="button"
              @click="activeQuadrant = 'E'"
              class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
              :class="[
                settings?.['cashflow_quadrant_image']
                  ? (activeQuadrant === 'E' ? 'bg-red-500/15 border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/30 scale-[0.98]' : 'border-transparent hover:bg-red-500/5 hover:border-red-500/20')
                  : 'border-transparent'
              ]"
              aria-label="Select Employee Quadrant"
            >
              <div v-if="settings?.['cashflow_quadrant_image']" class="absolute top-3 left-3 bg-red-950/80 border border-red-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-red-400 backdrop-blur-md">E</div>
            </button>

            <!-- Top Right: B -->
            <button
              type="button"
              @click="activeQuadrant = 'B'"
              class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
              :class="[
                settings?.['cashflow_quadrant_image']
                  ? (activeQuadrant === 'B' ? 'bg-accent/15 border-accent/50 shadow-[inset_0_0_20px_rgba(212,163,89,0.2)] ring-1 ring-accent/30 scale-[0.98]' : 'border-transparent hover:bg-accent/5 hover:border-accent/20')
                  : 'border-transparent'
              ]"
              aria-label="Select Business Owner Quadrant"
            >
              <div v-if="settings?.['cashflow_quadrant_image']" class="absolute top-3 right-3 bg-amber-950/80 border border-accent/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-accent backdrop-blur-md">B</div>
            </button>

            <!-- Bottom Left: S -->
            <button
              type="button"
              @click="activeQuadrant = 'S'"
              class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
              :class="[
                settings?.['cashflow_quadrant_image']
                  ? (activeQuadrant === 'S' ? 'bg-orange-500/15 border-orange-500/50 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/30 scale-[0.98]' : 'border-transparent hover:bg-orange-500/5 hover:border-orange-500/20')
                  : 'border-transparent'
              ]"
              aria-label="Select Self-Employed Quadrant"
            >
              <div v-if="settings?.['cashflow_quadrant_image']" class="absolute bottom-3 left-3 bg-orange-950/80 border border-orange-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-orange-400 backdrop-blur-md">S</div>
            </button>

            <!-- Bottom Right: I -->
            <button
              type="button"
              @click="activeQuadrant = 'I'"
              class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
              :class="[
                settings?.['cashflow_quadrant_image']
                  ? (activeQuadrant === 'I' ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30 scale-[0.98]' : 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/20')
                  : 'border-transparent'
              ]"
              aria-label="Select Investor Quadrant"
            >
              <div v-if="settings?.['cashflow_quadrant_image']" class="absolute bottom-3 right-3 bg-emerald-950/80 border border-emerald-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-emerald-400 backdrop-blur-md">I</div>
            </button>
          </div>
        </div>

        <div v-if="activeQuadrantInfo" class="nma-card p-6 border-accent/30 motion-safe:animate-fade-in">
          <h4 class="font-display font-extrabold text-lg text-accent mb-2">{{ activeQuadrantInfo.title }}</h4>
          <p class="text-sm text-zinc-650 mb-4 leading-relaxed">{{ activeQuadrantInfo.description }}</p>
          <div class="flex items-center gap-2 text-xs border-t border-zinc-200/50 pt-3">
            <span class="text-zinc-500 font-bold uppercase tracking-wider">Leverage Factor:</span>
            <span class="text-zinc-700 font-semibold">{{ activeQuadrantInfo.leverage }}</span>
          </div>
          <p v-if="activeQuadrant === 'B'" class="mt-4 text-xs font-bold text-accent uppercase tracking-wider">
            ★ Network Marketing = B Quadrant
          </p>
        </div>
      </div>

      <!-- Slide 6: Compensation Genealogy Binary -->
      <div v-if="currentSlide === 6" class="motion-safe:animate-fade-in space-y-8">
        <h2 class="text-2xl sm:text-3xl font-display font-black">Matched Sales Binary Model</h2>
        
        <div class="p-5 bg-white border border-zinc-200 rounded-xl space-y-4">
          <p class="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            A <strong>Binary Structure</strong> means you build only two sides: a <strong>Left Team</strong> and a <strong>Right Team</strong>. Every time you place a package referral on the Left and another on the Right, they pair to generate a <strong>Pairing Match Bonus (MSB)</strong>.
          </p>
          
          <!-- Genealogy illustration with Zoom & Pan Controls -->
          <div class="space-y-3">
            <!-- Controls Bar -->
            <div class="flex items-center justify-between bg-white border border-zinc-200/50 p-2 rounded-xl text-xs">
              <span class="font-semibold text-zinc-500 uppercase tracking-wider pl-2">Genealogy Visualizer</span>
              <div class="flex items-center gap-1">
                <button 
                  type="button" 
                  @click="zoomOutBinary" 
                  class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600"
                  title="Zoom Out"
                >
                  <ZoomOut :size="16" />
                </button>
                <span class="w-12 text-center font-mono font-bold text-zinc-750">
                  {{ Math.round(binaryZoom * 100) }}%
                </span>
                <button 
                  type="button" 
                  @click="zoomInBinary" 
                  class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600"
                  title="Zoom In"
                >
                  <ZoomIn :size="16" />
                </button>
                <button 
                  type="button" 
                  @click="resetBinaryZoom" 
                  class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600"
                  title="Reset Zoom"
                >
                  <RotateCcw :size="16" />
                </button>
                <div class="h-4 w-px bg-zinc-300 mx-1" />
                <button 
                  type="button" 
                  @click="toggleBinaryFullscreen" 
                  class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 :size="16" />
                </button>
              </div>
            </div>

            <!-- Viewport Container -->
            <div class="relative w-full max-h-[400px] overflow-auto border border-zinc-250/20 rounded-xl bg-white select-none py-10">
              <div 
                class="flex justify-center transition-transform duration-150 ease-out origin-top min-w-max px-8"
                :style="{ transform: `scale(${binaryZoom})` }"
              >
                <!-- A: Custom Uploaded Image Mode -->
                <div v-if="settings?.['binary_tree_image']" class="max-w-xl">
                  <img 
                    :src="getFullMediaUrl(settings['binary_tree_image'])" 
                    alt="Binary Tree" 
                    class="w-full h-auto object-contain rounded-lg"
                  />
                </div>

                <!-- B: Fallback CSS/Genealogy Tree Model -->
                <div v-else class="flex flex-col items-center">
                  <!-- Root node -->
                  <div class="px-5 py-2.5 bg-accent text-slate-900 font-extrabold rounded-xl text-xs tracking-wider shadow-glow">YOU</div>
                  <div class="h-6 w-0.5 bg-zinc-700"></div>

                  <!-- Level 1 split line -->
                  <div class="w-64 border-t border-zinc-700 flex justify-between">
                    <div class="h-6 w-0.5 bg-zinc-700"></div>
                    <div class="h-6 w-0.5 bg-zinc-700"></div>
                  </div>

                  <!-- Level 1 children (Left & Right Teams) -->
                  <div class="w-[360px] flex justify-between gap-6">
                    <!-- Left Branch -->
                    <div class="flex flex-col items-center">
                      <div class="px-4 py-2 bg-brand text-white font-bold rounded-lg text-xs shadow">Alex (Left Branch)</div>
                      <div class="h-6 w-0.5 bg-zinc-700"></div>

                      <!-- Left sub-split -->
                      <div class="w-28 border-t border-zinc-700 flex justify-between">
                        <div class="h-4 w-0.5 bg-zinc-700"></div>
                        <div class="h-4 w-0.5 bg-zinc-700"></div>
                      </div>
                      <div class="w-32 flex justify-between text-[10px] font-semibold text-zinc-400">
                        <span class="px-2 py-1 bg-white rounded border border-zinc-200/50">Bryan</span>
                        <span class="px-2 py-1 bg-white rounded border border-zinc-200/50">Chris</span>
                      </div>
                    </div>

                    <!-- Match Bonus Callout -->
                    <div class="self-center z-10 -my-4 px-3 py-1 bg-accent/20 border border-accent/40 text-accent font-black text-xs rounded-full shadow-glow">
                      $32 MATCH PAIR
                    </div>

                    <!-- Right Branch -->
                    <div class="flex flex-col items-center">
                      <div class="px-4 py-2 bg-brand text-white font-bold rounded-lg text-xs shadow">Bella (Right Branch)</div>
                      <div class="h-6 w-0.5 bg-zinc-700"></div>

                      <!-- Right sub-split -->
                      <div class="w-28 border-t border-zinc-700 flex justify-between">
                        <div class="h-4 w-0.5 bg-zinc-700"></div>
                        <div class="h-4 w-0.5 bg-zinc-700"></div>
                      </div>
                      <div class="w-32 flex justify-between text-[10px] font-semibold text-zinc-400">
                        <span class="px-2 py-1 bg-white rounded border border-zinc-200/50">Daniela</span>
                        <span class="px-2 py-1 bg-white rounded border border-zinc-200/50">Ella</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Lightbox / Fullscreen Modal -->
            <div 
              v-if="isBinaryFullscreen" 
              class="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col motion-safe:animate-fade-in"
            >
              <!-- Fullscreen Header -->
              <div class="flex items-center justify-between border-b border-zinc-200/30 p-4 bg-white/80">
                <span class="text-sm font-bold text-zinc-900">Genealogy Diagram (Fullscreen)</span>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="zoomOutBinary" 
                    class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700 hover:text-zinc-900"
                  >
                    <ZoomOut :size="18" />
                  </button>
                  <span class="w-12 text-center font-mono font-bold text-zinc-500">
                    {{ Math.round(binaryZoom * 100) }}%
                  </span>
                  <button 
                    type="button" 
                    @click="zoomInBinary" 
                    class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700 hover:text-zinc-900"
                  >
                    <ZoomIn :size="18" />
                  </button>
                  <button 
                    type="button" 
                    @click="resetBinaryZoom" 
                    class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700 hover:text-zinc-900"
                  >
                    <RotateCcw :size="18" />
                  </button>
                  <div class="h-5 w-px bg-zinc-700 mx-2" />
                  <button 
                    type="button" 
                    @click="toggleBinaryFullscreen" 
                    class="px-4 py-2 bg-accent hover:bg-accent-light text-zinc-900 font-extrabold rounded-xl transition text-xs"
                  >
                    Exit Fullscreen
                  </button>
                </div>
              </div>

              <!-- Fullscreen Scrollable Canvas -->
              <div class="flex-grow overflow-auto flex items-start justify-center p-8 cursor-grab active:cursor-grabbing">
                <div 
                  class="transition-transform duration-150 ease-out origin-top py-12"
                  :style="{ transform: `scale(${binaryZoom})` }"
                >
                  <!-- Content inside fullscreen -->
                  <div v-if="settings?.['binary_tree_image']" class="max-w-3xl">
                    <img 
                      :src="getFullMediaUrl(settings['binary_tree_image'])" 
                      alt="Binary Tree Diagram" 
                      class="w-full h-auto object-contain rounded-xl shadow-glow"
                    />
                  </div>
                  <div v-else class="flex flex-col items-center">
                    <!-- Standard fallback structure (larger inside fullscreen) -->
                    <div class="px-6 py-3 bg-accent text-slate-900 font-black rounded-xl text-sm tracking-wider shadow-glow">YOU</div>
                    <div class="h-8 w-0.5 bg-zinc-700"></div>

                    <div class="w-80 border-t border-zinc-700 flex justify-between">
                      <div class="h-8 w-0.5 bg-zinc-700"></div>
                      <div class="h-8 w-0.5 bg-zinc-700"></div>
                    </div>

                    <div class="w-[500px] flex justify-between gap-12">
                      <div class="flex flex-col items-center">
                        <div class="px-5 py-2.5 bg-brand text-white font-bold rounded-lg text-xs shadow">Alex (Left Branch)</div>
                        <div class="h-8 w-0.5 bg-zinc-700"></div>
                        <div class="w-36 border-t border-zinc-700 flex justify-between">
                          <div class="h-6 w-0.5 bg-zinc-700"></div>
                          <div class="h-6 w-0.5 bg-zinc-700"></div>
                        </div>
                        <div class="w-40 flex justify-between text-xs font-semibold text-zinc-400">
                          <span class="px-3 py-1.5 bg-white rounded border border-zinc-200/50">Bryan</span>
                          <span class="px-3 py-1.5 bg-white rounded border border-zinc-200/50">Chris</span>
                        </div>
                      </div>

                      <div class="self-center z-10 -my-4 px-4 py-1.5 bg-accent/20 border border-accent/40 text-accent font-black text-sm rounded-full shadow-glow">
                        $32 MATCH PAIR
                      </div>

                      <div class="flex flex-col items-center">
                        <div class="px-5 py-2.5 bg-brand text-white font-bold rounded-lg text-xs shadow">Bella (Right Branch)</div>
                        <div class="h-8 w-0.5 bg-zinc-700"></div>
                        <div class="w-36 border-t border-zinc-700 flex justify-between">
                          <div class="h-6 w-0.5 bg-zinc-700"></div>
                          <div class="h-6 w-0.5 bg-zinc-700"></div>
                        </div>
                        <div class="w-40 flex justify-between text-xs font-semibold text-zinc-400">
                          <span class="px-3 py-1.5 bg-white rounded border border-zinc-200/50">Daniela</span>
                          <span class="px-3 py-1.5 bg-white rounded border border-zinc-200/50">Ella</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-end">
            <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Earning Streams Breakdown</h3>
          </div>
          <p class="text-xs text-zinc-400">Click on any earning stream to show detailed explanations, dynamic calculators, and simulations.</p>
          <div class="space-y-3">
            <div 
              v-for="stream in earningStreams" 
              :key="stream.id" 
              @click="toggleFocusStream(stream.id)"
              class="nma-card p-5 flex flex-col gap-4 hover:border-accent transition duration-300 cursor-pointer"
              :class="{ 'border-accent ring-1 ring-accent bg-white/95': focusedStreamId === stream.id }"
            >
              <div class="flex gap-4">
                <span class="text-2xl">{{ stream.icon || '💰' }}</span>
                <div class="flex-grow">
                  <div class="flex justify-between items-center">
                    <h4 class="font-extrabold text-sm" :class="focusedStreamId === stream.id ? 'text-accent' : 'text-zinc-900'">
                      {{ stream.title }}
                    </h4>
                    <span class="text-[10px] text-zinc-500 font-semibold">
                      {{ focusedStreamId === stream.id ? 'Hide Details' : 'Show Details & Simulator' }}
                    </span>
                  </div>
                  <p class="text-xs text-zinc-500 leading-relaxed mt-1 font-light">{{ stream.shortDescription }}</p>
                  <p v-if="stream.longDescription && focusedStreamId === stream.id" class="text-[10px] text-zinc-400 mt-2 border-t border-zinc-200/50 pt-2 font-light">
                    {{ stream.longDescription }}
                  </p>
                </div>
              </div>
              
              <!-- Simulators for Focused Earning Streams -->
              <div v-if="focusedStreamId === stream.id" @click.stop class="border-t border-white/5 pt-4 mt-2">
                <!-- 1. DRB Simulator -->
                <div v-if="stream.slug === 'drb'" class="space-y-4 animate-fade-in">
                  <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Direct Referral Income Simulator</h5>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select referral package level:</label>
                      <select v-model="drbSimPkgId" class="w-full bg-white border border-zinc-200 rounded p-2 text-xs text-zinc-900">
                        <option v-for="p in catalogStore.packages" :key="p.id" :value="p.id">
                          {{ p.name }} (Referral bonus: {{ currencySymbol }}{{ getPriceForCountry(p, 'referralBonus') }})
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="flex justify-between text-[10px] text-zinc-400 uppercase font-bold mb-1">
                        <span>Number of personal referrals:</span>
                        <span class="text-amber-500 font-mono font-bold">{{ drbSimCount }}</span>
                      </label>
                      <input type="range" min="1" max="50" v-model.number="drbSimCount" class="w-full accent-amber-500" />
                    </div>
                    <div class="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                      <span class="font-bold text-zinc-350">Total Simulated DRB Earnings:</span>
                      <span class="font-mono text-base font-black text-amber-400">
                        {{ currencySymbol }}{{ formatNumber(simulatedDRBEarnings) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 2. MSB Simulator -->
                <div v-else-if="stream.slug === 'msb'" class="space-y-4 animate-fade-in">
                  <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Matched Sales (Pairing) Income Simulator</h5>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select structural package level:</label>
                      <select v-model="msbSimPkgId" class="w-full bg-white border border-zinc-200 rounded p-2 text-xs text-zinc-900">
                        <option v-for="p in catalogStore.packages" :key="p.id" :value="p.id">
                          {{ p.name }} (Pair bonus: {{ currencySymbol }}{{ getPriceForCountry(p, 'matchBonus') }})
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="flex justify-between text-[10px] text-zinc-400 uppercase font-bold mb-1">
                        <span>Number of matched pairs (Left & Right):</span>
                        <span class="text-amber-500 font-mono font-bold">{{ msbSimCount }}</span>
                      </label>
                      <input type="range" min="1" max="50" v-model.number="msbSimCount" class="w-full accent-amber-500" />
                    </div>
                    <div class="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                      <span class="font-bold text-zinc-350">Total Simulated MSB Earnings:</span>
                      <span class="font-mono text-base font-black text-amber-400">
                        {{ currencySymbol }}{{ formatNumber(simulatedMSBEarnings) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 3. Unilevel Simulator -->
                <div v-else-if="stream.slug === 'unilevel'" class="space-y-4 animate-fade-in">
                  <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Unilevel Passive Income Simulator</h5>
                  <p class="text-[10px] text-zinc-400 leading-relaxed">
                    Simulate active downline members ordering just 1 product package (e.g. C24/7 at 5% = $1.35) monthly.
                  </p>
                  <div class="space-y-3">
                    <div>
                      <label class="flex justify-between text-[10px] text-zinc-400 uppercase font-bold mb-1">
                        <span>Active Team Size (Downlines):</span>
                        <span class="text-amber-500 font-mono font-bold">{{ unilevelSimCount }}</span>
                      </label>
                      <input type="range" min="5" max="1000" step="5" v-model.number="unilevelSimCount" class="w-full accent-amber-500" />
                    </div>
                    <div class="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                      <span class="font-bold text-zinc-350">Estimated Monthly Passive Income:</span>
                      <span class="font-mono text-base font-black text-amber-400">
                        {{ currencySymbol }}{{ formatNumber(unilevelSimCount * 1.35 * conversionRate) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 4. Stairstep Matrix -->
                <div v-else-if="stream.slug === 'stairstep'" class="space-y-4 animate-fade-in">
                  <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Stairstep Rank Promotions Matrix</h5>
                  <div class="space-y-2 text-[10px]">
                    <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                      <span class="font-bold text-zinc-300">Silver Executive</span>
                      <span class="text-accent font-black">10 Points Required (Get +10% rebate)</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                      <span class="font-bold text-zinc-300">Gold Executive</span>
                      <span class="text-accent font-black">100 Points Required (Get +20% rebate)</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                      <span class="font-bold text-zinc-300">Global Ambassador</span>
                      <span class="text-accent font-black">1,000 Points Required (Get +30% rebate)</span>
                    </div>
                    <p class="text-[9px] text-zinc-500 italic mt-2">Points accumulate through group orders with no demotions and no time limit.</p>
                  </div>
                </div>

                <!-- Fallback info for other focused streams -->
                <div v-else class="text-[10px] text-zinc-400 leading-relaxed font-light">
                  This earning stream multiplies your passive income through long-term network duplication and team-wide reorders.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-widest text-accent">Compensation Plan</span>
            <h3 class="text-xl font-display font-black">Ways of Earning</h3>
            <p class="text-sm text-zinc-500 leading-relaxed max-w-3xl">
              These are the main routes through which members earn in the system. Each way should clearly explain the earning mechanism, the role it plays, and the expected result.
            </p>
          </div>

          <div v-if="ways.length === 0" class="nma-card p-6 text-zinc-500">
            There are no configured ways of earning yet. Please add them in the admin panel so the presentation reflects the latest compensation plan.
          </div>

          <div v-else class="grid gap-4 lg:grid-cols-2">
            <article v-for="way in ways" :key="way.id" class="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
              <div class="relative overflow-hidden bg-zinc-950/5">
                <div v-if="way.mediaType === 'video' && getVideoEmbedUrl(way.mediaUrl || way.image)" class="aspect-video bg-black">
                  <iframe
                    :src="getVideoEmbedUrl(way.mediaUrl || way.image)"
                    :title="`${way.title} video`"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="w-full h-full"
                  ></iframe>
                </div>
                <div v-else-if="way.mediaType === 'video' && (way.mediaUrl || way.image)" class="aspect-video bg-black">
                  <video muted autoplay loop playsinline class="w-full h-full object-cover">
                    <source :src="getFullMediaUrl(way.mediaUrl || way.image)" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div v-else-if="(way.mediaType === 'image' && (way.mediaUrl || way.image)) || (!way.mediaType && way.image)" class="aspect-video overflow-hidden bg-zinc-100">
                  <img :src="getFullMediaUrl(way.mediaType === 'image' ? (way.mediaUrl || way.image) : way.image)" :alt="way.title" class="w-full h-full object-cover" />
                </div>
                <div v-else class="aspect-video bg-accent/10 flex items-center justify-center text-accent text-4xl font-black">
                  <span class="inline-flex flex-col items-center gap-2">
                    <span>💼</span>
                    <span class="text-xs uppercase tracking-[0.3em]">Way of Earning</span>
                  </span>
                </div>
              </div>

              <div class="p-6 space-y-5">
                <div class="space-y-3">
                  <h4 class="text-2xl sm:text-3xl font-display font-black text-zinc-950 leading-tight">{{ way.title }}</h4>
                  <p v-if="!isWayExpanded(way.id)" class="text-sm leading-relaxed text-zinc-600">
                    {{ way.subtitle || 'This way explains the earning mechanism in a concise preview.' }}
                  </p>
                  <p v-else-if="way.body?.description" class="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
                    {{ way.body.description }}
                  </p>
                </div>

                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    @click="toggleWayDetails(way.id)"
                    class="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent/80"
                  >
                    {{ isWayExpanded(way.id) ? 'Hide details' : 'View details' }}
                  </button>
                </div>

                <div v-if="isWayExpanded(way.id) && way.body?.bullets?.length" class="rounded-3xl bg-zinc-50 p-4 border border-zinc-200">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-zinc-400 font-semibold mb-3">Highlights</p>
                  <ul class="space-y-2">
                    <li v-for="(bullet, index) in way.body.bullets" :key="index" class="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                      <span class="mt-1 h-2.5 w-2.5 rounded-full bg-accent"></span>
                      <span>{{ bullet }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- Slide 7: Entry Packages Selection -->
      <div v-if="currentSlide === 7" class="motion-safe:animate-fade-in space-y-6">
        <h2 class="text-2xl sm:text-3xl font-display font-black">Choose Your Entry Level ({{ selectedCountryCode }})</h2>
        <p class="text-xs text-zinc-500">Prices are automatically adjusted for country packaging and conversion rates.</p>

        <div class="grid gap-4">
          <div v-for="pkg in catalogStore.packages" :key="pkg.id" class="nma-card p-5 space-y-4 flex flex-col justify-between hover:border-accent transition">
            <div class="flex justify-between items-start border-b border-zinc-200/50 pb-3">
              <div>
                <h3 class="font-extrabold text-lg text-zinc-900">{{ pkg.name }}</h3>
                <p class="text-[10px] text-zinc-500 mt-0.5">Points value: {{ pkg.points }} pts</p>
              </div>
              <span class="font-black text-xl text-accent">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-white p-3 rounded-xl border border-zinc-200/50">
                <span class="block text-zinc-500 text-[10px] uppercase font-bold mb-0.5">Direct Bonus</span>
                <strong class="text-zinc-800 text-sm font-extrabold">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'referralBonus') }}</strong>
              </div>
              <div class="bg-white p-3 rounded-xl border border-zinc-200/50">
                <span class="block text-zinc-500 text-[10px] uppercase font-bold mb-0.5">Pairing Match</span>
                <strong class="text-zinc-800 text-sm font-extrabold">{{ currencySymbol }}{{ getPriceForCountry(pkg, 'matchBonus') }}</strong>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 mt-2">
              <UiButton variant="primary" class="flex-grow" @click="consultTrainerPackage(pkg)">
                Submit WhatsApp Order
              </UiButton>
              <UiButton variant="outline" class="flex-grow text-xs" @click="goToDetails(pkg.slug)">
                Benefits & Details
              </UiButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 8: FAQs & Finish -->
      <div v-if="currentSlide === 8" class="motion-safe:animate-fade-in space-y-8">
        <UiSectionLabel>Slide 8: Frequently Asked Questions</UiSectionLabel>
        <h2 class="text-2xl sm:text-3xl font-display font-black">Answers to Common Questions</h2>
        
        <input 
          v-model="searchQuery" 
          type="search" 
          placeholder="Search question keywords…" 
          class="nma-input-glass" 
        />

        <div class="nma-card overflow-hidden divide-y divide-zinc-200/50">
          <div v-for="faq in filteredFAQsList" :key="faq.id" class="transition-colors">
            <button
              type="button"
              @click="toggleFAQ(faq.id)"
              class="w-full text-left p-4 flex items-center justify-between hover:bg-zinc-100 transition"
            >
              <span class="font-bold text-xs sm:text-sm text-zinc-900 pr-4">{{ faq.question }}</span>
              <ChevronDown :size="16" class="text-zinc-400 shrink-0 transition-transform" :class="{ 'rotate-180': openFAQs.includes(faq.id) }" />
            </button>
            <div v-if="openFAQs.includes(faq.id)" class="px-4 pb-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-light whitespace-pre-line animate-fade-in">
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <!-- Call to action card -->
        <div class="nma-card p-6 sm:p-8 text-center space-y-5 border-accent/30 bg-gradient-to-br from-indigo-950/20 to-accent/5">
          <h3 class="font-display font-extrabold text-xl text-accent">{{ finishTitle }}</h3>
          <p class="text-xs sm:text-sm text-zinc-650 max-w-lg mx-auto">{{ finishMessage }}</p>
          
          <div v-if="memberStore.isRegistered && memberStore.canFeature('ownerMentor')" class="text-left pt-2">
            <OwnerMentorCard cta-label="Contact Coordinator Coach" />
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <UiButton variant="primary" @click="consultTrainerPackage({ name: 'Enrollment Request' })">
              Message Coordinator (WhatsApp)
            </UiButton>
            <UiButton v-if="memberStore.canFeature('courses')" variant="outline" to="/app/training">
              Continue to Training →
            </UiButton>
          </div>
        </div>
      </div>

    </main>

    <!-- Navigation Footer Bar -->
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { JOURNEY_IDS } from '../data/learnerJourneys';
import { Globe, ChevronDown, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-vue-next';
import AppLogo from '../components/ui/AppLogo.vue';
import UiSectionLabel from '../components/ui/UiSectionLabel.vue';
import UiProgress from '../components/ui/UiProgress.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useContentStore } from '../stores/content';
import { useMemberStore } from '../stores/member';
import OwnerMentorCard from '../components/journey/OwnerMentorCard.vue';
import api, { getFullMediaUrl } from '../api';

const router = useRouter();
const memberStore = useMemberStore();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const contentStore = useContentStore();

const currentSlide = ref(1);
const totalSlides = 8;

const focusedStreamId = ref(null);

const toggleFocusStream = (id) => {
  focusedStreamId.value = focusedStreamId.value === id ? null : id;
};

// Simulators data
const drbSimPkgId = ref(null);
const drbSimCount = ref(10);
const msbSimPkgId = ref(null);
const msbSimCount = ref(10);
const unilevelSimCount = ref(100);

const simulatedDRBEarnings = computed(() => {
  const pkg = catalogStore.packages.find(p => p.id === drbSimPkgId.value) || catalogStore.packages[0];
  if (!pkg) return 0;
  const priceObj = pkg.prices?.find((p) => p.countryCode === selectedCountryCode.value);
  const bonus = priceObj ? priceObj.referralBonus : (pkg.referralBonus || 0) * conversionRate.value;
  return bonus * drbSimCount.value;
});

const simulatedMSBEarnings = computed(() => {
  const pkg = catalogStore.packages.find(p => p.id === msbSimPkgId.value) || catalogStore.packages[0];
  if (!pkg) return 0;
  const priceObj = pkg.prices?.find((p) => p.countryCode === selectedCountryCode.value);
  const bonus = priceObj ? priceObj.matchBonus : (pkg.matchBonus || 0) * conversionRate.value;
  return bonus * msbSimCount.value;
});

const goToDetails = (slug) => {
  sessionStorage.setItem('presentation_slide', '7');
  router.push(`/package-details/${slug}`);
};
const showPostSignupWelcome = ref(false);
const expandedWayIds = ref([]);

const isWayExpanded = (id) => expandedWayIds.value.includes(id);
const toggleWayDetails = (id) => {
  if (expandedWayIds.value.includes(id)) {
    expandedWayIds.value = expandedWayIds.value.filter((itemId) => itemId !== id);
  } else {
    expandedWayIds.value = [...expandedWayIds.value, id];
  }
};

const nextSlide = () => {
  if (currentSlide.value < totalSlides) currentSlide.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const prevSlide = () => {
  if (currentSlide.value > 1) currentSlide.value--;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');
const activeQuadrant = ref('B');
const openFAQs = ref([]);

// Binary system zoom controls
const binaryZoom = ref(1);
const isBinaryFullscreen = ref(false);

const zoomInBinary = () => {
  if (binaryZoom.value < 3) {
    binaryZoom.value = Number((binaryZoom.value + 0.25).toFixed(2));
  }
};

const zoomOutBinary = () => {
  if (binaryZoom.value > 0.5) {
    binaryZoom.value = Number((binaryZoom.value - 0.25).toFixed(2));
  }
};

const resetBinaryZoom = () => {
  binaryZoom.value = 1;
};

const toggleBinaryFullscreen = () => {
  isBinaryFullscreen.value = !isBinaryFullscreen.value;
  binaryZoom.value = 1;
};
const searchQuery = ref('');
const rawFAQs = ref([]);

const quadrantData = {
  E: {
    title: 'E - Employee',
    description: 'You work for a boss and exchange hours directly for a paycheck. Your salary relies entirely on your attendance. If you stop working, your active income ceases.',
    leverage: 'Zero leverage. Your income is 100% dependent on your personal hourly time exchange.',
  },
  S: {
    title: 'S - Self-Employed',
    description: 'You own a small business or specialization (doctors, lawyers, consultants). If you do not perform, the business closes.',
    leverage: 'Individual leverage. Highly active, you cannot easily step away without stopping cashflow.',
  },
  B: {
    title: 'B - Business Owner',
    description: 'You build a system and lead a network of people. Cashflow is generated through duplication and leverage, continuing even in your absence.',
    leverage: 'High leverage. Duplicating networks makes this the lowest risk system to step into the B quadrant.',
  },
  I: {
    title: 'I - Investor',
    description: 'You acquire assets that generate money (real estate, dividends). Your investments act as leverage.',
    leverage: 'Compound capital leverage. Money works as your ultimate employee.',
  },
};

const activeQuadrantInfo = computed(() => quadrantData[activeQuadrant.value]);

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
  
  if (catalogStore.countries.length > 0 && !catalogStore.countries.some((c) => c.code === selectedCountryCode.value)) {
    selectedCountryCode.value = catalogStore.countries[0].code;
  }

  if (catalogStore.packages.length > 0) {
    drbSimPkgId.value = catalogStore.packages[0].id;
    msbSimPkgId.value = catalogStore.packages[0].id;
  }
});

const selectedCountryName = computed(() => catalogStore.selectedCountry?.name || 'Your Country');
const currencySymbol = computed(() => catalogStore.selectedCountry?.currencySymbol || '₦');

const conversionRate = computed(() => {
  const code = selectedCountryCode.value;
  if (code === 'KE') return 0.1;
  if (code === 'BI') return 2.0;
  if (code === 'US') return 0.00075;
  return 1.0;
});

const testimonials = computed(() => contentStore.testimonials);
const founders = computed(() => contentStore.founders);
const partners = computed(() => contentStore.manufacturingPartners);
const earningStreams = computed(() => contentStore.earningStreams);
const ways = computed(() => contentStore.ways);
const settings = computed(() => settingsStore.settings);

const finishTitle = computed(() => {
  if (!memberStore.isRegistered) return 'Ready to start your academy enrollment?';
  if (memberStore.canFeature('courses')) return 'Overview Complete';
  return 'Thank you for reviewing the business model';
});

const finishMessage = computed(() => {
  if (!memberStore.isRegistered) {
    return 'Speak to a trainer on WhatsApp to assist with packaging and pioneer positioning.';
  }
  if (memberStore.canFeature('courses')) {
    return 'Proceed directly to your personalized learning curriculum dashboard.';
  }
  return 'Your assigned journey is set to this slide-overview. Direct any questions to your active coordinator.';
});

const changeCountry = () => {
  catalogStore.selectCountry(selectedCountryCode.value);
};

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const resolvedUrl = new URL(url, window.location.origin);
    const hostname = resolvedUrl.hostname.toLowerCase();
    if (hostname.includes('youtube.com')) {
      const params = new URLSearchParams(resolvedUrl.search);
      const videoId = params.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${resolvedUrl.pathname.slice(1)}`;
    }
    if (hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video/${resolvedUrl.pathname.split('/').pop()}`;
    }
  } catch (err) {
    return null;
  }
  return null;
};

const getPriceForCountry = (pkg, field) => {
  const priceObj = pkg.prices?.find((p) => p.countryCode === selectedCountryCode.value);
  if (priceObj) return formatNumber(priceObj[field]);
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
  const text = encodeURIComponent(`Hello Trainer, I am reviewing the ${pkg.name} (${currencySymbol.value}${getPriceForCountry(pkg, 'price')}) in ${selectedCountryName.value}. Please guide me on binary slot positioning.`);
  window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
};

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
  return rawFAQs.value.filter((f) =>
    f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});

const toggleFAQ = (id) => {
  const index = openFAQs.value.indexOf(id);
  if (index === -1) openFAQs.value.push(id);
  else openFAQs.value.splice(index, 1);
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
  to { opacity: 1; transform: translateY(0); }
}
</style>
