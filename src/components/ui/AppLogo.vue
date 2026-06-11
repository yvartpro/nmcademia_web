<template>
  <div class="flex items-center gap-3">
    <img
      v-if="logoUrl"
      :src="logoUrl"
      alt="Network Marketing Academia"
      class="object-contain transition-all"
      :class="size === 'sm' ? 'h-8 md:h-9 w-auto max-w-[150px]' : 'h-10 md:h-12 w-auto max-w-[200px]'"
    />
    <div
      v-else
      class="rounded-xl nma-gradient-gold flex items-center justify-center font-display font-bold text-zinc-900 shrink-0"
      :class="size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'"
    >
      NMA
    </div>
    <div v-if="showText">
      <h1 class="font-display font-semibold leading-tight text-zinc-900" :class="size === 'sm' ? 'text-sm' : 'text-base'">
        Network Marketing Academia
      </h1>
      <p v-if="showTagline && size !== 'sm'" class="text-[10px] text-zinc-500 uppercase tracking-wider">
        Build. Lead. Earn.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logoUrl: { type: String, default: '' },
  showText: { type: Boolean, default: true },
  showTagline: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
});
</script>
