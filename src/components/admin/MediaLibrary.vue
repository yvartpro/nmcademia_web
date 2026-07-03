<template>
  <div class="space-y-6 animate-fade-in">

    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Media Library</h3>
        <p class="text-zinc-500 text-xs mt-1">
          Images → <code class="text-[#008A20]/80">uploads/images/</code> &nbsp;·&nbsp;
          Videos → <code class="text-[#008A20]/80">uploads/videos/</code> &nbsp;·&nbsp;
          Thumbnails → <code class="text-[#008A20]/80">uploads/images/</code>
        </p>
      </div>
      <MediaPicker
        v-model="selectedMediaId"
        assetType="all"
        label="Upload media"
        :showLibraryToggle="false"
      />
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        @click="activeFilter = tab.value"
        class="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150"
        :class="activeFilter === tab.value
          ? 'bg-white text-[#008A20] shadow-sm'
          : 'text-zinc-500 hover:text-zinc-700'"
      >
        {{ tab.label }}
        <span class="ml-1 text-[9px] font-semibold opacity-60">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="mediaStore.loading" class="flex items-center gap-2 text-zinc-400 text-xs py-8 justify-center">
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      Loading media…
    </div>

    <!-- Grid -->
    <div v-else-if="filteredAssets.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      <MediaCard
        v-for="asset in filteredAssets"
        :key="asset.id"
        :asset="asset"
        :selected="selectable && modelValue === asset.id"
        @click="handleCardClick(asset)"
      />
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
        <svg class="w-7 h-7 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
        </svg>
      </div>
      <p class="text-zinc-400 text-sm font-medium">No media here yet</p>
      <p class="text-zinc-300 text-xs mt-1">Upload an image or video to get started</p>
    </div>

    <!-- Detail Modal -->
    <MediaDetail
      :asset="detailAsset"
      @close="detailAsset = null"
      @deleted="onDeleted"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMediaStore } from '../../stores/media';
import MediaPicker from './MediaPicker.vue';
import MediaCard from './MediaCard.vue';
import MediaDetail from './MediaDetail.vue';

const props = defineProps({
  selectable: { type: Boolean, default: false },
  modelValue: { type: [Number, String, null], default: null }
});

const emit = defineEmits(['select', 'update:modelValue']);

const mediaStore = useMediaStore();
const selectedMediaId = ref(null);
const detailAsset = ref(null);
const activeFilter = ref('all');

onMounted(() => mediaStore.fetchAll());

const tabs = computed(() => [
  { label: 'All',    value: 'all',   count: mediaStore.assets.length },
  { label: 'Images', value: 'image', count: mediaStore.assets.filter(a => a.type === 'image').length },
  { label: 'Videos', value: 'video', count: mediaStore.assets.filter(a => a.type === 'video').length }
]);

const filteredAssets = computed(() => {
  if (activeFilter.value === 'all') return mediaStore.assets;
  return mediaStore.assets.filter(a => a.type === activeFilter.value);
});

const handleCardClick = (asset) => {
  if (props.selectable) {
    emit('select', asset);
    emit('update:modelValue', asset.id);
    return;
  }
  detailAsset.value = asset;
};

const onDeleted = (id) => {
  if (detailAsset.value?.id === id) detailAsset.value = null;
};

const onUpdated = (updatedAsset) => {
  // The store already updates assets in place; sync detailAsset ref too
  detailAsset.value = updatedAsset;
};
</script>
