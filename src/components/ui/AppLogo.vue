<template>
  <div class="flex items-center gap-3">
    <img
      v-if="logoUrl"
      :src="logoUrl"
      alt="Network Marketing Academia"
      class="rounded-xl object-contain"
      :class="size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'"
    />
    <div
      v-else
      class="rounded-xl nma-gradient-gold flex items-center justify-center font-display font-bold text-zinc-900 shrink-0"
      :class="size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'"
    >
      NMA
    </div>
    <div v-if="showText">
      <h1 class="font-display font-semibold leading-tight text-zinc-900 dark:text-zinc-100" :class="size === 'sm' ? 'text-sm' : 'text-base'">
        Network Marketing Academia
      </h1>
      <p v-if="showTagline && size !== 'sm'" class="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
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
