<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-3">
      <h2 class="text-3xl sm:text-4xl font-display font-black text-zinc-900 leading-tight">
        Your Launch Investment
      </h2>
      <p class="text-sm text-zinc-500 leading-relaxed max-w-xl">
        Packages available in {{ selectedCountryCode }} — prices shown in {{ currencySymbol }}.
      </p>
    </div>

    <div v-if="countryPackages.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="pkg in countryPackages"
        :key="pkg.id"
        class="flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm"
      >
        <div v-if="pkg.image" class="h-36 overflow-hidden bg-zinc-100">
          <img
            :src="getFullMediaUrl(pkg.image)"
            :alt="pkg.name"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex flex-col flex-1 p-5 space-y-2">
          <h3 class="font-extrabold text-lg text-zinc-900">{{ pkg.name }}</h3>
          <p v-if="pkg.description" class="text-xs text-zinc-500 line-clamp-2">{{ pkg.description }}</p>
          <p class="pt-2 font-black text-2xl text-accent">
            {{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 text-zinc-400">
      <div class="text-5xl mb-4">🌍</div>
      <p class="font-semibold text-zinc-500">No packages available for <strong>{{ selectedCountryCode }}</strong>.</p>
      <p class="text-xs mt-1">Switch country in the top bar to see other options.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getFullMediaUrl } from '../../api';

const props = defineProps({
  packages: { type: Array, default: () => [] },
  selectedCountryCode: { type: String, default: 'NG' },
  currencySymbol: { type: String, default: '₦' },
  getPriceForCountry: { type: Function, required: true },
});

const countryPackages = computed(() =>
  props.packages.filter(pkg =>
    pkg.prices?.some(p => p.countryCode === props.selectedCountryCode)
  )
);
</script>
