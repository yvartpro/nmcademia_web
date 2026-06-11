<template>
  <button
    type="button"
    @click="$emit('toggle')"
    :class="[
      'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all duration-200 nma-touch',
      selected
        ? 'border-accent bg-accent-muted/60 text-zinc-900 border-accent/50'
        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50',
    ]"
  >
    <span v-if="selected" class="text-accent">✓</span>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  selected: { type: Boolean, default: false },
});

defineEmits(['toggle']);
</script>
