<template>
  <div class="space-y-3">
    <slot :page-items="pageItems" />
    <nav
      v-if="pageCount > 1"
      class="flex items-center justify-between gap-3 text-xs text-zinc-500"
      aria-label="List pagination"
    >
      <span>Showing {{ firstItem }}–{{ lastItem }} of {{ items.length }}</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="rounded border border-zinc-200 px-3 py-1.5 font-semibold text-zinc-700 transition hover:border-[#008A20] hover:text-[#008A20] disabled:cursor-not-allowed disabled:opacity-40"
          @click="currentPage--"
        >
          Previous
        </button>
        <span class="min-w-12 text-center tabular-nums">{{ currentPage }} / {{ pageCount }}</span>
        <button
          type="button"
          :disabled="currentPage === pageCount"
          class="rounded border border-zinc-200 px-3 py-1.5 font-semibold text-zinc-700 transition hover:border-[#008A20] hover:text-[#008A20] disabled:cursor-not-allowed disabled:opacity-40"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 15 }
});

const currentPage = ref(1);
const pageCount = computed(() => Math.ceil(props.items.length / props.pageSize));
const pageItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.items.slice(start, start + props.pageSize);
});
const firstItem = computed(() => (currentPage.value - 1) * props.pageSize + 1);
const lastItem = computed(() => Math.min(currentPage.value * props.pageSize, props.items.length));

watch(() => props.items, () => {
  currentPage.value = 1;
});

watch(pageCount, (count) => {
  if (currentPage.value > count) currentPage.value = Math.max(count, 1);
});
</script>