<template>
  <div class="min-h-screen flex flex-col nma-gradient-mesh">
    <PublicHeader :logo-url="logoUrl" />

    <main class="flex-grow flex flex-col items-center px-4 py-6 sm:py-10">
      <!-- Progress (hidden on hero step) -->
      <div v-if="currentStep > 1" class="w-full max-w-2xl mb-6 motion-safe:animate-fade-in">
        <UiProgress :current="currentStep" :total="totalSteps" />
      </div>

      <div
        class="w-full max-w-2xl nma-card p-6 sm:p-10 motion-safe:animate-slide-up"
        :class="currentStep === 1 ? 'max-w-4xl bg-transparent border-0 shadow-none p-0 sm:p-0' : ''"
      >
        <slot />
      </div>
    </main>

    <footer v-if="showFooter" class="border-t border-zinc-200/80 px-4 py-6 text-center">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>© 2026 Network Marketing Academia</p>
        <p>Official Partner: Alliance In Motion Global</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import PublicHeader from './PublicHeader.vue';
import UiProgress from '../components/ui/UiProgress.vue';

defineProps({
  currentStep: { type: Number, default: 1 },
  totalSteps: { type: Number, default: 9 },
  logoUrl: { type: String, default: '' },
  showFooter: { type: Boolean, default: true },
});
</script>
