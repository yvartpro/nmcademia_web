<template>
  <div ref="root" class="relative" :class="fullWidth ? 'w-full' : ''">
    <button
      type="button"
      class="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl transition-colors hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40"
      :class="[
        fullWidth ? 'w-full justify-between' : '',
        compact ? 'px-3 py-1.5 text-xs font-semibold' : 'px-4 py-3 text-sm',
      ]"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="flex items-center gap-2 min-w-0">
        <CountryFlag
          v-if="selected && !showAllOption"
          :flag-icon="selected.flagIcon"
          :code="selected.code"
          :name="selected.name"
          size="sm"
        />
        <span class="truncate text-zinc-800 dark:text-zinc-100">{{ triggerLabel }}</span>
      </span>
      <ChevronDown :size="14" class="text-zinc-400 shrink-0 transition-transform" :class="{ 'rotate-180': open }" />
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full min-w-[220px] max-h-60 overflow-y-auto nma-scrollbar rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1"
      role="listbox"
    >
      <button
        v-if="showAllOption"
        type="button"
        class="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        :class="modelValue === '' ? 'bg-accent/10 text-accent-dark dark:text-accent-light' : 'text-zinc-700 dark:text-zinc-300'"
        role="option"
        :aria-selected="modelValue === ''"
        @click="pick('')"
      >
        <span class="w-5 h-4 shrink-0" />
        {{ allLabel }}
      </button>
      <button
        v-for="c in countryList"
        :key="c.code"
        type="button"
        class="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        :class="modelValue === c.code ? 'bg-accent/10 text-accent-dark dark:text-accent-light' : 'text-zinc-700 dark:text-zinc-300'"
        role="option"
        :aria-selected="modelValue === c.code"
        @click="pick(c.code)"
      >
        <CountryFlag :flag-icon="c.flagIcon" :code="c.code" :name="c.name" size="sm" />
        <span class="flex-1 truncate">{{ optionLabel(c) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import CountryFlag from './CountryFlag.vue';
import { useCatalogStore } from '../../stores/catalog';

const props = defineProps({
  modelValue: { type: String, default: '' },
  countries: { type: Array, default: null },
  compact: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: true },
  showCurrency: { type: Boolean, default: false },
  showAllOption: { type: Boolean, default: false },
  allLabel: { type: String, default: 'All countries' },
});

const emit = defineEmits(['update:modelValue', 'change']);

const catalogStore = useCatalogStore();
const open = ref(false);
const root = ref(null);

const countryList = computed(() => props.countries || catalogStore.countries);

const selected = computed(() =>
  countryList.value.find((c) => c.code === props.modelValue) || null
);

const triggerLabel = computed(() => {
  if (props.showAllOption && !props.modelValue) return props.allLabel;
  if (!selected.value) return 'Select country';
  if (props.compact) {
    return props.showCurrency
      ? `${selected.value.code} (${selected.value.currencySymbol})`
      : selected.value.code;
  }
  return optionLabel(selected.value);
});

function optionLabel(c) {
  if (props.compact && props.showCurrency) {
    return `${c.name} (${c.currencySymbol})`;
  }
  return c.name;
}

function toggle() {
  open.value = !open.value;
}

function pick(code) {
  emit('update:modelValue', code);
  emit('change', code);
  open.value = false;
}

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>
