<template>
  <button
    type="button"
    role="radio"
    :aria-checked="selected"
    @click="$emit('select')"
    :class="[
      'w-full text-left border rounded-xl p-4 transition-all duration-200 flex items-start gap-3 nma-touch',
      selected
        ? 'border-accent bg-accent-muted/50 shadow-glow ring-1 ring-accent/30'
        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
    ]"
  >
    <div
      class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
      :class="selected ? 'border-accent bg-accent' : 'border-zinc-400'"
    >
      <div v-if="selected" class="w-2 h-2 bg-zinc-900 rounded-full" />
    </div>
    <div class="flex-1 min-w-0">
      <span class="text-sm font-medium" :class="selected ? 'text-zinc-900' : 'text-zinc-700'">
        <slot>{{ label }}</slot>
      </span>
      <p v-if="description" class="text-xs text-zinc-500 mt-1">{{ description }}</p>
    </div>
    <span v-if="icon" class="text-xl shrink-0">{{ icon }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  selected: { type: Boolean, default: false },
});

defineEmits(['select']);
</script>
