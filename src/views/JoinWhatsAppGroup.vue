<template>
  <div class="min-h-screen bg-surface-0 nma-gradient-mesh font-sans flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200/80 bg-surface-1/90 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <AppLogo size="sm" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-2xl nma-card-glass p-6 sm:p-10 space-y-8 text-center">
        
        <!-- WhatsApp Icon -->
        <div class="flex justify-center">
          <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-glow">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.922 5.636-4.922 9.322 0 1.069.152 2.14.454 3.184l-3.285 9.96a.75.75 0 001.18.847l10.227-3.305h1.12c3.676 0 7.07-1.461 9.63-4.112 2.56-2.65 3.96-6.144 3.96-9.883s-1.4-7.233-3.96-9.883c-2.56-2.65-5.954-4.112-9.63-4.112" />
            </svg>
          </div>
        </div>

        <!-- Main Message -->
        <div class="space-y-4">
          <h1 class="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900">
            Welcome to <span class="nma-gradient-text">Our Community</span>
          </h1>
          <p class="text-base sm:text-lg text-zinc-600 leading-relaxed">
            There is currently no physical office in your country yet, but you're not alone! 
            Join our exclusive WhatsApp group to connect with mentors, ask questions, and grow together.
          </p>
        </div>

        <!-- Country Info -->
        <div class="bg-accent/5 border border-accent/20 rounded-xl p-4 sm:p-6 space-y-2">
          <p class="text-sm text-zinc-600">
            <strong>Your Location:</strong>
            <span class="flex items-center justify-center gap-2 mt-2">
              <CountryFlag v-if="country" :flag-icon="country.flagIcon" :code="country.code" size="md" />
              <span class="font-semibold">{{ country?.name || 'Loading...' }}</span>
            </span>
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            v-if="whatsappLink"
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.922 5.636-4.922 9.322 0 1.069.152 2.14.454 3.184l-3.285 9.96a.75.75 0 001.18.847l10.227-3.305h1.12c3.676 0 7.07-1.461 9.63-4.112 2.56-2.65 3.96-6.144 3.96-9.883s-1.4-7.233-3.96-9.883c-2.56-2.65-5.954-4.112-9.63-4.112" />
            </svg>
            Join WhatsApp Group
          </a>
          <router-link 
            to="/"
            class="flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition"
          >
            Back to Home
          </router-link>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-left">
          <p class="text-xs font-semibold text-blue-900 uppercase tracking-wide">📚 What You'll Get</p>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>✓ Direct access to trainers and mentors</li>
            <li>✓ Real-time support and guidance</li>
            <li>✓ Community of like-minded builders</li>
            <li>✓ Exclusive updates and opportunities</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMemberStore } from '../stores/member';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import AppLogo from '../components/ui/AppLogo.vue';
import CountryFlag from '../components/ui/CountryFlag.vue';

const memberStore = useMemberStore();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();

const country = computed(() => {
  return catalogStore.countryByCode(memberStore.profile.country);
});

const whatsappLink = computed(() => {
  const link = settingsStore.settings?.whatsapp_new_to_mlm_group_link;
  return link;
});

onMounted(async () => {
  if (catalogStore.countries.length === 0) {
    await catalogStore.fetchCountries();
  }
  await settingsStore.fetchSettings();
});
</script>

<style scoped>
.nma-gradient-text {
  background: linear-gradient(135deg, #008A20 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-glow {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}
</style>
