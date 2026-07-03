<template>
  <button
    type="button"
    @click="$emit('click', asset)"
    class="group relative bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 text-left w-full"
    :class="[
      selected
        ? 'border-[#008A20] ring-2 ring-[#008A20]/25 shadow-md'
        : 'border-zinc-200 hover:border-[#008A20]/40 hover:shadow-md'
    ]"
  >
    <!-- Thumbnail / Preview -->
    <div class="aspect-square bg-[#F4F6F5] relative overflow-hidden">
      <!-- Image asset -->
      <img
        v-if="asset.type === 'image'"
        :src="thumbSrc"
        :alt="asset.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="broken = true"
      />

      <!-- Video asset with thumbnail -->
      <template v-else-if="asset.type === 'video' && thumbSrc && !broken">
        <img
          :src="thumbSrc"
          :alt="asset.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          @error="broken = true"
        />
        <!-- Play overlay -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30 transition-transform duration-200 group-hover:scale-110">
            <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </template>

      <!-- Video with no thumbnail -->
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center gap-1 bg-zinc-100"
      >
        <svg class="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"/>
        </svg>
        <span class="text-[10px] text-zinc-400 font-medium">No thumbnail</span>
      </div>

      <!-- Broken preview fallback -->
      <div
        v-if="broken"
        class="absolute inset-0 flex items-center justify-center bg-red-50 text-red-400 text-[10px] p-2 text-center"
      >
        <span>⚠ Preview unavailable</span>
      </div>

      <!-- Type badge -->
      <span class="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full backdrop-blur-sm border"
        :class="asset.type === 'video'
          ? 'bg-violet-600/90 text-white border-violet-500/30'
          : 'bg-white/90 text-zinc-600 border-zinc-200/60'"
      >
        {{ asset.type }}
      </span>

      <!-- Selected check -->
      <div
        v-if="selected"
        class="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#008A20] flex items-center justify-center shadow"
      >
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
      </div>
    </div>

    <!-- Title -->
    <div class="px-2.5 py-2">
      <p class="text-[11px] font-semibold text-zinc-800 truncate leading-tight" :title="asset.title">
        {{ asset.title || 'Untitled' }}
      </p>
    </div>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMediaStore } from '../../stores/media';

const props = defineProps({
  asset: { type: Object, required: true },
  selected: { type: Boolean, default: false }
});

defineEmits(['click']);

const mediaStore = useMediaStore();
const broken = ref(false);

const thumbSrc = computed(() => {
  if (!props.asset) return '';
  if (props.asset.type === 'video' && props.asset.thumbnailPath) {
    return mediaStore.resolveUrl(props.asset.thumbnailPath);
  }
  if (props.asset.type === 'image') {
    return mediaStore.resolveUrl(props.asset);
  }
  return '';
});
</script>
