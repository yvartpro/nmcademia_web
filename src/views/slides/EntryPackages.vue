<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-3">
      <h2 class="text-3xl sm:text-4xl font-display font-black text-zinc-900 leading-tight">
        Entry Packages for {{ selectedCountryCode }}
      </h2>
      <p class="text-base text-zinc-600 leading-relaxed max-w-xl">
        Select the tier that fits your goals. Each package unlocks binary positioning and sets your referral reward level.
      </p>
    </div>

    <div v-if="countryPackages.length > 0" class="grid gap-6 sm:grid-cols-2">
      <article
        v-for="pkg in countryPackages"
        :key="pkg.id"
        class="group relative flex flex-col rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="pkg.featured ? 'border-accent/50 bg-gradient-to-b from-accent/[0.04] to-white' : 'border-zinc-200 bg-white'"
      >
        <div v-if="pkg.featured" class="absolute top-3 right-3 z-10">
          <span class="text-[10px] font-black uppercase tracking-wide bg-accent text-white px-2.5 py-1 rounded-full shadow-sm">
            Popular
          </span>
        </div>

        <!-- Image -->
        <div class="relative h-48 overflow-hidden bg-zinc-100">
          <img
            v-if="pkg.image"
            :src="getFullMediaUrl(pkg.image)"
            :alt="pkg.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
            <span class="text-5xl opacity-40">📦</span>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <h3 class="font-extrabold text-lg text-white drop-shadow-sm leading-tight">{{ pkg.name }}</h3>
            <span class="shrink-0 font-black text-xl text-white drop-shadow-sm">
              {{ currencySymbol }}{{ getPriceForCountry(pkg, 'price') }}
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="flex flex-col flex-1 p-5 space-y-4">
          <p v-if="pkg.description" class="text-sm text-zinc-600 leading-relaxed line-clamp-3">
            {{ pkg.description }}
          </p>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
              <span class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Direct Bonus</span>
              <strong class="text-sm font-extrabold text-zinc-900">
                {{ currencySymbol }}{{ getPriceForCountry(pkg, 'referralBonus') }}
              </strong>
            </div>
            <div class="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
              <span class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Match Bonus</span>
              <strong class="text-sm font-extrabold text-zinc-900">
                {{ currencySymbol }}{{ getPriceForCountry(pkg, 'matchBonus') }}
              </strong>
            </div>
          </div>

          <div class="mt-auto flex flex-col sm:flex-row gap-2 pt-1">
            <UiButton variant="primary" class="flex-1" @click="$emit('consult', pkg)">
              Order now
            </UiButton>
            <UiButton variant="outline" class="flex-1" @click="$emit('details', pkg.slug)">
              Details
            </UiButton>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-16 text-zinc-400">
      <div class="text-5xl mb-4">🌍</div>
      <p class="font-semibold text-zinc-500">No entry packages for <strong>{{ selectedCountryCode }}</strong>.</p>
      <p class="text-sm mt-1">Switch country in the top bar or contact your coordinator.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getFullMediaUrl } from '../../api';
import UiButton from '../../components/ui/UiButton.vue';

const props = defineProps({
  packages: { type: Array, default: () => [] },
  selectedCountryCode: { type: String, default: 'NG' },
  currencySymbol: { type: String, default: '₦' },
  getPriceForCountry: { type: Function, required: true },
});

defineEmits(['consult', 'details']);

const countryPackages = computed(() =>
  props.packages.filter(pkg =>
    pkg.prices?.some(p => p.countryCode === props.selectedCountryCode)
  )
);
</script>
