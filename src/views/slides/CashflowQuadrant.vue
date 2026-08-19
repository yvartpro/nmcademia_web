<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl sm:text-3xl font-display font-black">{{ $t('presentation.quadrant.title') }}</h2>
      <p class="text-base text-zinc-600 leading-relaxed">{{ settings['cashflow_quadrant_explanation'] }}</p>
    </div>

    <!-- Interactive Quadrant -->
    <div class="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 bg-white shadow-xl group">
      <!-- Custom Image Mode -->
      <img
        v-if="settings?.['cashflow_quadrant_image']"
        :src="getFullMediaUrl(settings['cashflow_quadrant_image'])"
        alt="Cashflow Quadrant"
        class="w-full h-full object-cover transition-all duration-500"
      />

      <!-- CSS Fallback Mode -->
      <div v-else class="w-full h-full grid grid-cols-2 grid-rows-2 p-4 gap-4 bg-gradient-to-br from-zinc-900 to-indigo-950/40">
        <div
          class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
          :class="activeQuadrant === 'E' ? 'bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
        >
          <span class="text-3xl font-black text-red-500/80">E</span>
          <div>
              <h4 class="text-xs font-extrabold text-zinc-300">{{ $t('presentation.quadrant.E.titleShort') }}</h4>
              <p class="text-[9px] text-zinc-500 mt-0.5">{{ $t('presentation.quadrant.E.subtitle') }}</p>
          </div>
        </div>

        <div
          class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
          :class="activeQuadrant === 'B' ? 'bg-accent/10 border-accent/40 ring-1 ring-accent/30' : 'bg-white/[0.02] border-white/[0.05]'"
        >
          <span class="text-3xl font-black text-accent">B</span>
          <div>
            <h4 class="text-xs font-extrabold text-zinc-300">{{ $t('presentation.quadrant.B.titleShort') }}</h4>
            <p class="text-[9px] text-zinc-500 mt-0.5">{{ $t('presentation.quadrant.B.subtitle') }}</p>
          </div>
        </div>

        <div
          class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
          :class="activeQuadrant === 'S' ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
        >
          <span class="text-3xl font-black text-orange-500/80">S</span>
          <div>
            <h4 class="text-xs font-extrabold text-zinc-300">{{ $t('presentation.quadrant.S.titleShort') }}</h4>
            <p class="text-[9px] text-zinc-500 mt-0.5">{{ $t('presentation.quadrant.S.subtitle') }}</p>
          </div>
        </div>

        <div
          class="relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4"
          :class="activeQuadrant === 'I' ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30' : 'bg-white/[0.02] border-white/[0.05]'"
        >
          <span class="text-3xl font-black text-emerald-500/80">I</span>
          <div>
            <h4 class="text-xs font-extrabold text-zinc-300">{{ $t('presentation.quadrant.I.titleShort') }}</h4>
            <p class="text-[9px] text-zinc-500 mt-0.5">{{ $t('presentation.quadrant.I.subtitle') }}</p>
          </div>
        </div>
      </div>

      <!-- Absolute Clickable Hotspots -->
      <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 gap-2">
        <button
          type="button"
          @click="$emit('update:activeQuadrant', 'E')"
          class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
          :class="[
            settings?.['cashflow_quadrant_image']
              ? (activeQuadrant === 'E' ? 'bg-red-500/15 border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/30 scale-[0.98]' : 'border-transparent hover:bg-red-500/5 hover:border-red-500/20')
              : 'border-transparent'
          ]"
          :aria-label="$t('presentation.quadrant.accessibility.employee')"
        >
          <div v-if="settings?.['cashflow_quadrant_image']" class="absolute top-3 left-3 bg-red-950/80 border border-red-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-red-400 backdrop-blur-md">E</div>
        </button>

        <button
          type="button"
          @click="$emit('update:activeQuadrant', 'B')"
          class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
          :class="[
            settings?.['cashflow_quadrant_image']
              ? (activeQuadrant === 'B' ? 'bg-accent/15 border-accent/50 shadow-[inset_0_0_20px_rgba(212,163,89,0.2)] ring-1 ring-accent/30 scale-[0.98]' : 'border-transparent hover:bg-accent/5 hover:border-accent/20')
              : 'border-transparent'
          ]"
          :aria-label="$t('presentation.quadrant.accessibility.businessOwner')"
        >
          <div v-if="settings?.['cashflow_quadrant_image']" class="absolute top-3 right-3 bg-amber-950/80 border border-accent/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-accent backdrop-blur-md">B</div>
        </button>

        <button
          type="button"
          @click="$emit('update:activeQuadrant', 'S')"
          class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
          :class="[
            settings?.['cashflow_quadrant_image']
              ? (activeQuadrant === 'S' ? 'bg-orange-500/15 border-orange-500/50 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/30 scale-[0.98]' : 'border-transparent hover:bg-orange-500/5 hover:border-orange-500/20')
              : 'border-transparent'
          ]"
          :aria-label="$t('presentation.quadrant.accessibility.selfEmployed')"
        >
          <div v-if="settings?.['cashflow_quadrant_image']" class="absolute bottom-3 left-3 bg-orange-950/80 border border-orange-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-orange-400 backdrop-blur-md">S</div>
        </button>

        <button
          type="button"
          @click="$emit('update:activeQuadrant', 'I')"
          class="relative rounded-xl border transition-all duration-350 focus:outline-none flex flex-col justify-between p-4"
          :class="[
            settings?.['cashflow_quadrant_image']
              ? (activeQuadrant === 'I' ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30 scale-[0.98]' : 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/20')
              : 'border-transparent'
          ]"
          :aria-label="$t('presentation.quadrant.accessibility.investor')"
        >
          <div v-if="settings?.['cashflow_quadrant_image']" class="absolute bottom-3 right-3 bg-emerald-950/80 border border-emerald-500/30 rounded-lg px-2 py-0.5 text-[10px] font-black text-emerald-400 backdrop-blur-md">I</div>
        </button>
      </div>
    </div>

    <!-- Active Quadrant Info Panel -->
    <div v-if="activeQuadrantInfo" class="nma-card p-6 border-accent/30 motion-safe:animate-fade-in">
      <h4 class="font-display font-extrabold text-lg text-accent mb-2">{{ activeQuadrantInfo.title }}</h4>
      <p class="text-base text-zinc-700 mb-4 leading-relaxed">{{ activeQuadrantInfo.description }}</p>
      <div class="flex items-center gap-2 text-sm border-t border-zinc-200/50 pt-3">
        <span class="text-zinc-500 font-bold uppercase tracking-wider">{{ $t('presentation.quadrant.leverageLabel') }}</span>
        <span class="text-zinc-700 font-semibold">{{ activeQuadrantInfo.leverage }}</span>
      </div>
      <p v-if="activeQuadrant === 'B'" class="mt-4 text-sm font-bold text-accent uppercase tracking-wider">
        {{ $t('presentation.quadrant.networkMarketingNote') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getFullMediaUrl } from '../../api';

const props = defineProps({
  settings: { type: Object, required: true },
  activeQuadrant: { type: String, default: 'B' },
});

defineEmits(['update:activeQuadrant']);

import { useTranslationsStore } from '../../stores/translations';

const translationsStore = useTranslationsStore();

const quadrantData = {
  E: {
    title: translationsStore.t('presentation.quadrant.E.title'),
    description: translationsStore.t('presentation.quadrant.E.description'),
    leverage: translationsStore.t('presentation.quadrant.E.leverage'),
  },
  S: {
    title: translationsStore.t('presentation.quadrant.S.title'),
    description: translationsStore.t('presentation.quadrant.S.description'),
    leverage: translationsStore.t('presentation.quadrant.S.leverage'),
  },
  B: {
    title: translationsStore.t('presentation.quadrant.B.title'),
    description: translationsStore.t('presentation.quadrant.B.description'),
    leverage: translationsStore.t('presentation.quadrant.B.leverage'),
  },
  I: {
    title: translationsStore.t('presentation.quadrant.I.title'),
    description: translationsStore.t('presentation.quadrant.I.description'),
    leverage: translationsStore.t('presentation.quadrant.I.leverage'),
  },
};

const activeQuadrantInfo = computed(() => quadrantData[props.activeQuadrant]);
</script>
