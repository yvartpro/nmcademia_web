<template>
  <span class="inline-flex items-center gap-2 min-w-0" :class="inline ? '' : 'flex-wrap'">
    <CountryFlag
      :flag-icon="resolved.flagIcon"
      :code="resolved.code"
      :name="resolved.name"
      :size="size"
    />
    <span v-if="showName" class="truncate">{{ resolved.name }}</span>
    <span v-if="showCode" class="font-mono font-semibold uppercase" :class="codeClass">{{ resolved.code }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import CountryFlag from './CountryFlag.vue';
import { useCatalogStore } from '../../stores/catalog';

const props = defineProps({
  /** ISO country code e.g. NG */
  code: { type: String, required: true },
  /** Optional country object (skips catalog lookup) */
  country: { type: Object, default: null },
  size: { type: String, default: 'sm' },
  showName: { type: Boolean, default: false },
  showCode: { type: Boolean, default: true },
  codeClass: { type: String, default: '' },
  inline: { type: Boolean, default: true },
});

const catalogStore = useCatalogStore();

const resolved = computed(() => {
  if (props.country) return props.country;
  return catalogStore.countryByCode(props.code) || {
    code: props.code,
    name: props.code,
    flagIcon: '',
  };
});
</script>
