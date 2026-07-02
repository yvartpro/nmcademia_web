<template>
  <div class="funnel-page min-h-screen bg-surface-0 flex flex-col justify-between nma-gradient-mesh font-sans pb-10">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <router-link to="/">
          <AppLogo size="sm" />
        </router-link>
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-xs text-zinc-500 hover:text-accent font-medium">✕ Exit Funnel</router-link>
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
        <div v-if="funnelId === 'new-to-nm'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 leading-tight">
              Is Network Marketing Academia for<span class="nma-gradient-text"> You?</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              A better future begins with the courage to take calculated risks.<br /><br />

              The greatest entrepreneurs, innovators, and leaders in history all stepped beyond their comfort zones to pursue a greater vision. Network marketing is no different.<br /><br />

              It is not for those seeking guarantees or shortcuts. It is for people who are willing to learn, grow, embrace challenges, develop leadership, and persevere when others give up.<br /><br />

              The question is simple:<br /><br />

              Will fear keep you where you are, or will courage help you create the future you truly want?<br /><br />

              If you're ready to invest in yourself, step beyond your comfort zone, and build something meaningful, welcome to Network Marketing Academia—your journey starts here.<br />
            </p>
            <div 
              @click="playIntroVideo"
              class="aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
            >
              <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
              <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                <Play :size="28" class="text-white ml-1" />
              </div>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">Get Started →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Create Your <span class="nma-gradient-text">Account</span>
            </h2>
            <form @submit.prevent="submitLeadAndContinue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone Number (Optional)</label>
                <input v-model="form.phone" type="tel" class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  By signing up, I agree to receive learning materials, updates, and communications from Network Marketing Academia.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Continue →</UiButton>
              </div>
            </form>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Select Your <span class="nma-gradient-text">Country</span>
            </h2>
            <p class="text-sm text-zinc-500">We tailor the product prices, currencies, and support mentors based on your location.</p>
            <div class="space-y-4">
              <select v-model="selectedCountry" class="nma-input-glass">
                <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" @click="saveCountryAndRedirect">Access Presentation →</UiButton>
            </div>
          </div>
        </div>

        <!-- ================= PATH 2: ALREADY IN NM (already-in-nm) ================= -->
        <div v-else-if="funnelId === 'already-in-nm'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Accelerate Your <span class="nma-gradient-text">Leadership</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              Congratulations on building in the Network Marketing industry. You have stepped into a business that rewards courage, vision, and duplication.
            </p>
            <div class="p-5 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
              <h4 class="font-bold text-accent text-sm">Why Professional Training Matters:</h4>
              <p class="text-xs text-zinc-650">
                Excitement alone isn't enough. Success in duplication requires modern lead generation systems, high-ticket mentoring, and team leadership.
              </p>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">Analyze Challenges →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              What is <span class="nma-gradient-text">Holding You Back</span>?
            </h2>
            <p class="text-sm text-zinc-500">Select the challenges you are currently facing in your organization:</p>
            <div class="grid sm:grid-cols-2 gap-3">
              <label 
                v-for="ch in challengeOptions" 
                :key="ch" 
                class="flex items-center gap-3 p-4 bg-white/5 border rounded-xl cursor-pointer hover:border-accent transition"
                :class="selectedChallenges.includes(ch) ? 'border-accent bg-accent/5' : 'border-zinc-200'"
              >
                <input 
                  type="checkbox" 
                  :value="ch" 
                  v-model="selectedChallenges" 
                  class="rounded text-accent focus:ring-accent border-zinc-300" 
                />
                <span class="text-xs sm:text-sm font-semibold">{{ ch }}</span>
              </label>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" :disabled="selectedChallenges.length === 0" @click="nextStep">Next Step →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Elite Academy <span class="nma-gradient-text">Coaching Track</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              We provide tailored mentorship modules to solve the exact bottlenecks you selected:
            </p>
            <div class="space-y-3">
              <div v-for="ch in selectedChallenges" :key="ch" class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                <span class="text-emerald-500 font-bold">✓</span>
                <span class="text-xs text-zinc-800 font-semibold">{{ getChallengeSolution(ch) }}</span>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" @click="nextStep">Match with Mentor →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 4" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Your Assigned <span class="nma-gradient-text">Coach</span>
            </h2>
            
            <div v-if="matchingAnimation" class="h-48 flex flex-col items-center justify-center gap-4">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              <p class="text-sm font-semibold animate-pulse text-zinc-400">Scanning network leaders matching your profile...</p>
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
                  <p class="text-xs text-emerald-600">{{ ownerStore.intro || 'Your dedicated Academy Coach' }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <p class="text-sm leading-relaxed text-zinc-600">
                  Fill in your details below to schedule your consultation and connect with your coach.
                </p>
                <form @submit.prevent="submitLeadAndCompleteFlow" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                    <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                    <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone / WhatsApp Number</label>
                    <input v-model="form.phone" type="tel" required class="nma-input-glass" placeholder="+2348030001111" />
                  </div>
                  <label class="flex items-start gap-3 cursor-pointer mt-4">
                    <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                    <span class="text-xs sm:text-sm text-zinc-650">
                      I agree to let NMA match me with an active coach and send me coaching updates.
                    </span>
                  </label>
                  <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                    <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                    <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Confirm Coach & WhatsApp →</UiButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= PATH 3: WANT TO SWITCH COMPANIES (switch-companies) ================= -->
        <div v-else-if="funnelId === 'switch-companies'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Company Switching <span class="nma-gradient-text">Evaluation</span>
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-zinc-500 mb-1">Current Company Name</label>
                <input v-model="assessment.currentCompany" type="text" class="nma-input-glass" placeholder="E.g. Herbalife, Jeunesse, Oriflame..." />
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 mb-1">Your Monthly Network Volume (USD Estimate)</label>
                <input v-model="assessment.volume" type="text" class="nma-input-glass" placeholder="E.g. $1,000 / month" />
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 mb-1">What are the primary reasons you want to transition?</label>
                <textarea v-model="assessment.reasons" rows="3" class="nma-input-glass resize-none" placeholder="E.g., High product cost, complex binary payout, poor team retention..."></textarea>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" to="/">Cancel</UiButton>
              <UiButton variant="primary" :disabled="!assessment.currentCompany" @click="nextStep">Analyze Reasons →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Why Leaders <span class="nma-gradient-text">Switch Companies</span>
            </h2>
            <div class="space-y-4 text-sm leading-relaxed text-zinc-600">
              <p>Many professional network builders run into the same hurdles:</p>
              <ul class="space-y-2 pl-4 list-disc text-xs sm:text-sm">
                <li><strong>Outdated Compensation Models:</strong> Heavy retail requirements instead of team leverage.</li>
                <li><strong>No Real duplication Systems:</strong> Being forced to do home presentations without digital lead capture.</li>
                <li><strong>Lack of Direct Mentorship:</strong> Leaders who disappear once you sign up.</li>
              </ul>
              <div class="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                <p class="text-xs text-accent font-semibold leading-relaxed">
                  At Alliance In Motion Global and NMA, we prioritize group accumulation points, dynamic compression (ensuring you earn even with inactive lines), and global pioneer positioning.
                </p>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" @click="nextStep">Consult Mentor →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Schedule Your <span class="nma-gradient-text">Private Strategy Session</span>
            </h2>
            <p class="text-sm text-zinc-500">Provide your details to connect with a senior leader on transitioning your organization.</p>
            <form @submit.prevent="submitLeadAndCompleteFlow" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">WhatsApp / Phone Number</label>
                <input v-model="form.phone" type="tel" required class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  I consent to private leader-to-leader communication and scheduling options.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Request Transition Consult →</UiButton>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= PATH 4: JUST EXPLORING (exploring) ================= -->
        <div v-else-if="funnelId === 'exploring'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Qualification <span class="nma-gradient-text">Questions</span>
            </h2>
            <div 
              @click="playIntroVideo"
              class="mt-3 aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
            >
              <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
              <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                <Play :size="28" class="text-white ml-1" />
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-zinc-500 mb-2">How many hours per week can you allocate?</label>
                <select v-model="exploreQs.hours" class="nma-input-glass">
                  <option value="5-10">5 - 10 hours</option>
                  <option value="10-20">10 - 20 hours</option>
                  <option value="20+">20+ hours (Full Time)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-zinc-500 mb-2">Are you willing to participate in active mentorship and learning?</label>
                <div class="flex gap-4">
                  <button 
                    type="button" 
                    @click="exploreQs.coachable = 'yes'"
                    class="flex-1 py-3 px-4 border rounded-xl font-bold transition text-xs sm:text-sm"
                    :class="exploreQs.coachable === 'yes' ? 'bg-accent/10 border-accent text-accent' : 'border-zinc-250'"
                  >Yes, 100%</button>
                  <button 
                    type="button" 
                    @click="exploreQs.coachable = 'no'"
                    class="flex-1 py-3 px-4 border rounded-xl font-bold transition text-xs sm:text-sm"
                    :class="exploreQs.coachable === 'no' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'border-zinc-250'"
                  >No, I prefer doing it alone</button>
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-4 border-t border-zinc-200/50">
              <UiButton variant="primary" :disabled="!exploreQs.hours || !exploreQs.coachable" @click="nextStep">Next →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Your <span class="nma-gradient-text">Details</span>
            </h2>
            <form @submit.prevent="submitLeadAndContinue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone Number (Optional)</label>
                <input v-model="form.phone" type="tel" class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  I agree to receive materials to explore the business opportunity.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Continue →</UiButton>
              </div>
            </form>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Short Version <span class="nma-gradient-text">Presentation</span>
            </h2>
            <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-600">
              <p>Here is a summary of the business ecosystem:</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span class="block text-lg font-black text-accent">25% Discount</span>
                  <span class="text-[10px] text-zinc-400">On all products for personal health use or retail.</span>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span class="block text-lg font-black text-accent">Direct Referrals</span>
                  <span class="text-[10px] text-zinc-400">Earn direct commissions from $16 up to $528 per referral.</span>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span class="block text-lg font-black text-accent">Binary Match</span>
                  <span class="text-[10px] text-zinc-400">Pairing left & right sales branches to earn bonuses.</span>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span class="block text-lg font-black text-accent">Group Points</span>
                  <span class="text-[10px] text-zinc-400">No time frames or demotions in rank commissions.</span>
                </div>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" @click="saveCountryAndRedirect">Access Full Dashboard →</UiButton>
            </div>
          </div>
        </div>

        <!-- ================= PATH 5: TIRED OF SINGLE INCOME (income-diversification) ================= -->
        <div v-else-if="funnelId === 'income-diversification'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              The Vulnerability of a <span class="nma-gradient-text">Single Income</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              Depending on a single job salary in today's economy is highly risky. Inflation, company lay-offs, and rising expenses are quietly eroding financial freedom.
            </p>
            <div 
              @click="playIntroVideo"
              class="mt-3 aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
            >
              <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
              <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                <Play :size="28" class="text-white ml-1" />
              </div>
            </div>
            <div class="p-5 bg-zinc-900/60 border border-white/5 rounded-xl">
              <p class="text-xs sm:text-sm italic text-zinc-300">
                "True financial stability is built in the B (Business Owner) and I (Investor) quadrants, where duplication and systems generate passive leverage." - Robert Kiyosaki
              </p>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">Explore Benefits →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Why Create a <span class="nma-gradient-text">Side Network</span>?
            </h2>
            <div class="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <strong class="text-accent">Part-Time Flexibility:</strong>
                <p class="text-zinc-500 mt-1">Keep your current job and build your team in your free evening/weekend hours.</p>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <strong class="text-accent">Leveraged Income:</strong>
                <p class="text-zinc-500 mt-1">Earning from the cumulative reorder and signup points of your entire downline.</p>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <strong class="text-accent">Digital Lead Capture:</strong>
                <p class="text-zinc-500 mt-1">No need to solicit family. Use social media and NMA funnels to attract prospects.</p>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <strong class="text-accent">Pre-Built Infrastructure:</strong>
                <p class="text-zinc-500 mt-1">AGG manages product shipping, logistics, and legal setups across 40+ countries.</p>
              </div>
            </div>
            <div class="flex justify-between pt-4 border-t border-zinc-200/50">
              <UiButton variant="ghost" @click="prevStep">Back</UiButton>
              <UiButton variant="primary" @click="nextStep">Submit Details →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 3" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Unlock Your <span class="nma-gradient-text">Path</span>
            </h2>
            <form @submit.prevent="submitLeadAndContinue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone Number (Optional)</label>
                <input v-model="form.phone" type="tel" class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  I agree to receive training and side business presentation details.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Proceed to Presentation →</UiButton>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= PATH 6: JOBLESS (jobless) ================= -->
        <div v-else-if="funnelId === 'jobless'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Launch Your Own <span class="nma-gradient-text">Business Venture</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              When traditional jobs are scarce, building networks is the most accessible vehicle to start with limited capital. We focus on teaching digital marketing and leadership skills from scratch.
            </p>
            <div 
              @click="playIntroVideo"
              class="mt-3 aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-glow relative cursor-pointer group flex items-center justify-center"
            >
              <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition duration-500"></div>
              <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                <Play :size="28" class="text-white ml-1" />
              </div>
            </div>
            <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h4 class="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-1">Zero prior experience needed</h4>
              <p class="text-xs text-zinc-650">
                Our curriculum teaches you communication, marketing systems, and team building from zero.
              </p>
            </div>
            <div class="flex justify-end">
              <UiButton variant="primary" @click="nextStep">Register Details →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Enter the <span class="nma-gradient-text">Academia</span>
            </h2>
            <form @submit.prevent="submitLeadAndContinue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Phone Number (Optional)</label>
                <input v-model="form.phone" type="tel" class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  I agree to join NMA to access free training modules and presentation.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Create Free Account →</UiButton>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= PATH 7: FAST TRACK (fast-track) ================= -->
        <div v-else-if="funnelId === 'fast-track'" class="space-y-6">
          <div v-if="currentStepIndex === 1" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Position Yourself as a <span class="nma-gradient-text">Pioneer Leader</span>
            </h2>
            <p class="text-sm sm:text-base leading-relaxed text-zinc-650">
              For ambitious builders who want to skip the introductions and proceed directly to securing entry packages and team registration.
            </p>
            <div class="space-y-3">
              <div v-for="pkg in packages" :key="pkg.name" class="p-4 bg-white/5 border border-white/5 hover:border-accent rounded-xl flex justify-between items-center transition">
                <div>
                  <h4 class="font-bold text-sm text-zinc-200">{{ pkg.name }}</h4>
                  <span class="text-[10px] text-zinc-500">{{ pkg.desc }}</span>
                </div>
                <span class="font-bold text-accent text-sm sm:text-base">{{ pkg.price }}</span>
              </div>
            </div>
            <div class="flex justify-end pt-4 border-t border-zinc-200/50">
              <UiButton variant="primary" @click="nextStep">Proceed to Registration Info →</UiButton>
            </div>
          </div>

          <div v-else-if="currentStepIndex === 2" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">
              Secure Your <span class="nma-gradient-text">Pioneer Slot</span>
            </h2>
            <p class="text-sm text-zinc-500">Provide your information to be directly assigned a senior coach for packaging registration and shipping assistance.</p>
            <form @submit.prevent="submitLeadAndCompleteFlow" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" required class="nma-input-glass" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Email Address</label>
                <input v-model="form.email" type="email" required class="nma-input-glass" placeholder="john@example.com" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">WhatsApp / Phone Number</label>
                <input v-model="form.phone" type="tel" required class="nma-input-glass" placeholder="+2348030001111" />
              </div>
              <label class="flex items-start gap-3 cursor-pointer mt-4">
                <input v-model="form.consent" type="checkbox" required class="mt-1 rounded border-zinc-300 text-accent focus:ring-accent" />
                <span class="text-xs sm:text-sm text-zinc-650">
                  I agree to match with a pioneer coach and receive immediate package registration support on WhatsApp.
                </span>
              </label>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200/50">
                <UiButton variant="ghost" @click="prevStep">Back</UiButton>
                <UiButton variant="primary" :disabled="submitting || !form.consent" :loading="submitting" type="submit">Direct Coach Assignment →</UiButton>
              </div>
            </form>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-xs text-zinc-500">
      <p>© 2026 Network Marketing Academia • Official Partner: Alliance In Motion Global</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

import { useOwnerStore } from '../stores/owner';

const route = useRoute();
const router = useRouter();

const ownerStore = useOwnerStore();

const videoStore = useVideoPlayerStore();
const settingsStore = useSettingsStore();

const openVideo = (src, title) => {
  videoStore.open({ src, title });
};

const introVideoSrc = computed(() => {
  const s = settingsStore.settings?.risk_video || settingsStore.settings?.nm_video_url || 'https://www.youtube.com/embed/j-j72H2rJqA';
  return videoStore.resolveUrl(s);
});

const playIntroVideo = () => openVideo(introVideoSrc.value, 'What is Network Marketing');

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
});

// Paths specific content
const challengeOptions = [
  'Recruiting prospects',
  'Fear of rejection',
  'Team members quitting (retention)',
  'Lack of upline support',
  'Inconsistent daily habits',
  'Duplicating a simple presentation system'
];
const selectedChallenges = ref([]);

const getChallengeSolution = (challenge) => {
  if (challenge.includes('Recruiting')) return 'Social Media Lead Generation systems.';
  if (challenge.includes('rejection')) return 'Mindset Coaching & Sorting methods.';
  if (challenge.includes('retention')) return 'Duplicating training materials.';
  if (challenge.includes('upline')) return 'Assigned Elite Academia Coach matching.';
  if (challenge.includes('habits')) return 'Daily Quests and Streaks trackers.';
  return 'Interactive presentation slides.';
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
  
  router.push(journey.afterSignupRoute);
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
    
    // Redirect to direct WhatsApp contact of the mentor
    const whatsappNum = ownerStore.whatsappNumber || catalogStore.selectedCountry?.whatsappNumber || '+2348030001111';
    const coachName = ownerStore.name || 'Coach';
    const text = encodeURIComponent(`Hello ${coachName}, I just completed my onboarding on Network Marketing Academia under path [${segmentLabel}]. Please guide me on my customized leadership track.`);
    window.open(`https://wa.me/${whatsappNum.replace(/\+/g, '')}?text=${text}`, '_blank');
    
    router.push(journey.afterSignupRoute);
  } finally {
    submitting.value = false;
  }
};

const getSegmentLabel = (fid) => {
  switch (fid) {
    case 'new-to-nm': return 'I am new to network marketing';
    case 'already-in-nm': return 'I am already in network marketing';
    case 'switch-companies': return 'I am in network marketing but not satisfied and want to switch companies';
    case 'exploring': return 'I am just exploring opportunities';
    case 'income-diversification': return 'I am tired of depending on one source of income';
    case 'jobless': return 'I am tired of being jobless';
    case 'fast-track': return 'I want this business by all means';
    default: return 'I am just exploring opportunities';
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
