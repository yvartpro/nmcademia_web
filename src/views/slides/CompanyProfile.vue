<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-4">
      <h2 class="text-3xl sm:text-4xl font-display font-black leading-tight text-zinc-950">
        {{ settings['partner_company_name'] || $t('presentation.company.partnerName') }}
      </h2>
      <p class="text-base text-zinc-500 font-semibold tracking-wide">{{ $t('presentation.company.tagline') }}</p>
    </div>

    <div class="nma-card p-6 leading-relaxed text-zinc-650 whitespace-pre-line text-base sm:text-lg border-accent/20">
      {{ settings['partner_company_intro'] }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  settings: { type: Object, required: true },
});
</script>
