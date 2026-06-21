<template>
  <div class="motion-safe:animate-fade-in space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl sm:text-3xl font-display font-black">Visionary Founders</h2>
      <p class="text-xs text-zinc-500 whitespace-pre-line">{{ settings['partner_company_profile'] }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div
        v-for="founder in founders"
        :key="founder.id"
        class="nma-card p-5 space-y-4 hover:border-accent transition-all duration-300"
      >
        <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-zinc-200 shrink-0">
          <img
            v-if="founder.photo"
            :src="getFullMediaUrl(founder.photo)"
            :alt="founder.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-zinc-500 font-bold text-lg">
            {{ founder.name.split(' ').map(n => n[0]).join('') }}
          </span>
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
        <div
          v-for="partner in partners"
          :key="partner.id"
          class="p-5 bg-white border border-zinc-200 hover:border-accent rounded-xl flex items-center gap-4 transition"
        >
          <div class="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center border border-zinc-200 shrink-0">
            <img
              v-if="partner.logo"
              :src="getFullMediaUrl(partner.logo)"
              :alt="partner.name"
              class="w-full h-full object-contain"
            />
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
</template>

<script setup>
import { getFullMediaUrl } from '../../api';

defineProps({
  settings: { type: Object, required: true },
  founders: { type: Array, default: () => [] },
  partners: { type: Array, default: () => [] },
});
</script>
