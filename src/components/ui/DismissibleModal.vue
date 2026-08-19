<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/30" @click="close"></div>
    <div class="relative bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-lg w-full p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-[#0A0F0D]">{{ title }}</h3>
          <p class="text-sm text-zinc-500 mt-1">{{ subtitle }}</p>
        </div>
        <button @click="close" class="text-zinc-400 hover:text-zinc-700">✕</button>
      </div>
      <div class="mt-4">
        <slot />
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="close" class="border border-zinc-200 bg-white px-4 py-2 rounded-lg text-xs font-semibold">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Notice' },
  subtitle: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
const visible = ref(props.modelValue);

watch(() => props.modelValue, (v) => {
  visible.value = v;
});

const close = () => {
  visible.value = false;
  emit('update:modelValue', false);
  const ev = new CustomEvent('dismissible-modal-close');
  window.dispatchEvent(ev);
};
</script>
