<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-4">
      <h2 class="text-2xl sm:text-3xl font-display font-black">What is Your Dream?</h2>
      <p class="text-sm leading-relaxed text-zinc-650 bg-accent/5 p-6 rounded-xl border border-accent/10">
        {{ settings['dream_section_text'] }}
      </p>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-bold font-display">Testimonials</h3>
      <div class="grid gap-4">
        <div
          v-for="test in testimonials"
          :key="test.id"
          class="nma-card p-5 flex flex-col sm:flex-row gap-4 items-start"
        >
          <div class="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-bold text-sm">
            {{ test.name.split(' ').map(n => n[0]).join('') }}
          </div>
          <div class="space-y-2">
            <p class="text-sm text-zinc-650 italic">"{{ test.quote }}"</p>
            <h4 class="font-bold text-xs">{{ test.name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  settings: { type: Object, required: true },
  testimonials: { type: Array, default: () => [] },
});
</script>
