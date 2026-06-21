<template>
  <div class="motion-safe:animate-fade-in space-y-6">
    <h2 class="text-2xl sm:text-3xl font-display font-black">Choose Your Entry Level ({{ selectedCountryCode }})</h2>
    <p class="text-xs text-zinc-500">Prices are automatically adjusted for country packaging and conversion rates.</p>

    <div class="grid gap-4">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="nma-card p-5 space-y-4 flex flex-col justify-between hover:border-accent transition"
      >
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
          <UiButton variant="primary" class="flex-grow" @click="$emit('consult', pkg)">
            Submit WhatsApp Order
          </UiButton>
          <UiButton variant="outline" class="flex-grow text-xs" @click="$emit('details', pkg.slug)">
            Benefits & Details
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiButton from '../../components/ui/UiButton.vue';

defineProps({
  packages: { type: Array, default: () => [] },
  selectedCountryCode: { type: String, default: 'NG' },
  currencySymbol: { type: String, default: '₦' },
  getPriceForCountry: { type: Function, required: true },
});

defineEmits(['consult', 'details']);
</script>
