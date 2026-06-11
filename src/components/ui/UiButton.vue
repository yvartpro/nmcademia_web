<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot v-else />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
});

const tag = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return 'a';
  return 'button';
});

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed nma-touch';
  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-3.5',
  };
  const variants = {
    primary: 'bg-[#008A20] text-white font-bold hover:bg-[#006616] focus-visible:ring-[#008A20] shadow-sm',
    secondary: 'bg-[#0A0F0D] text-white hover:bg-[#0A0F0D]/80 focus-visible:ring-[#0A0F0D]',
    ghost: 'text-zinc-600 hover:bg-zinc-100 focus-visible:ring-zinc-400',
    outline: 'border border-zinc-300 text-[#0A0F0D] hover:bg-[#F4F6F5] focus-visible:ring-[#008A20]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  };
  return [
    base,
    sizes[props.size] || sizes.md,
    variants[props.variant] || variants.primary,
    props.fullWidth ? 'w-full' : '',
  ].join(' ');
});
</script>
