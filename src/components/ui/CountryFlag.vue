<template>
  <span
    class="inline-block shrink-0 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800"
    :class="[shapeClass, sizeClass]"
    :title="title || undefined"
    role="img"
    :aria-label="title || 'Country flag'"
  >
    <span :class="flagClasses" class="block w-full h-full bg-cover bg-center" />
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { parseFlagClasses } from '../../utils/countryFlag';

const props = defineProps({
  flagIcon: { type: String, default: '' },
  code: { type: String, default: '' },
  name: { type: String, default: '' },
  size: { type: String, default: 'md' },
  square: { type: Boolean, default: true },
});

const flagClasses = computed(() => {
  const base = parseFlagClasses(props.flagIcon, props.code);
  return props.square ? `${base} fis` : `${base} fir`;
});

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-4 h-3',
    sm: 'w-5 h-4',
    md: 'w-6 h-4',
    lg: 'w-8 h-6',
  };
  return sizes[props.size] || sizes.md;
});

const shapeClass = computed(() => (props.square ? '' : 'aspect-[4/3]'));

const title = computed(() => props.name || props.code || '');
</script>

<style scoped>
.fis {
  background-size: cover;
}
</style>
