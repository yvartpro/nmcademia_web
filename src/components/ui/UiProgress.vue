<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex justify-between items-center mb-2 text-xs text-zinc-500">
      <span>{{ label || `Step ${current} of ${total}` }}</span>
      <span v-if="percentage !== null">{{ Math.round(percentage) }}%</span>
    </div>
    <div class="flex gap-1" role="progressbar" :aria-valuenow="current" :aria-valuemin="1" :aria-valuemax="total">
      <div
        v-for="i in total"
        :key="i"
        class="h-1 flex-1 rounded-full overflow-hidden bg-zinc-200"
      >
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="i <= current ? 'nma-gradient-gold' : 'w-0'"
          :style="{ width: i <= current ? '100%' : '0%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: true },
});

const percentage = computed(() => (props.current / props.total) * 100);
</script>
