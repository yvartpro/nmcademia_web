<template>
  <div class="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-white/[0.06] gap-3">
    <UiButton variant="ghost" size="sm" type="button" @click="$emit('back')">Back</UiButton>
    <UiButton
      variant="primary"
      size="sm"
      :type="isSubmit ? 'submit' : 'button'"
      :disabled="nextDisabled"
      :loading="nextLoading"
      @click="!isSubmit && $emit('next')"
    >
      {{ nextLabel || 'Continue' }}
    </UiButton>
  </div>
</template>

<script setup>
import UiButton from '../ui/UiButton.vue';

defineProps({
  nextLabel: { type: String, default: 'Continue' },
  nextDisabled: { type: Boolean, default: false },
  nextLoading: { type: Boolean, default: false },
  isSubmit: { type: Boolean, default: false },
});

defineEmits(['back', 'next']);
</script>
