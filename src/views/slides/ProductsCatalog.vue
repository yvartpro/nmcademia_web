<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <h2 class="text-2xl sm:text-3xl font-display font-black">World-Class Health & Wellness</h2>

    <div
      v-if="presentationVideoSrc"
      @click="openVideo"
      class="aspect-video bg-white rounded-2xl overflow-hidden shadow-glow border border-zinc-200 relative cursor-pointer group flex items-center justify-center"
    >
      <!-- Thumbnail background -->
      <img
        v-if="previewImage"
        :src="previewImage"
        alt="Video preview"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 bg-zinc-100 group-hover:bg-zinc-200 transition duration-500"></div>
      <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300"></div>
      <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
        <p class="text-base font-bold">{{ presentation?.title || 'Country presentation' }}</p>
        <p v-if="presentation?.description" class="text-sm mt-1 text-white/80 line-clamp-2">{{ presentation.description }}</p>
      </div>
      <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
        <Play :size="28" class="text-white ml-1" />
      </div>
    </div>
    <div v-else class="aspect-video bg-white rounded-2xl overflow-hidden shadow-glow border border-zinc-200 flex flex-col items-center justify-center text-zinc-500 text-base">
      Video presentation goes here
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="nma-card p-5 flex flex-col items-center text-center hover:border-accent transition duration-300"
      >
        <div class="w-20 h-20 bg-zinc-50 rounded-2xl p-2 border border-zinc-250/20 mb-3 flex items-center justify-center">
          <img
            v-if="product.image"
            :src="getFullMediaUrl(product.image)"
            :alt="product.name"
            class="w-full h-full object-contain"
          />
        </div>
        <h4 class="font-extrabold text-base text-zinc-900">{{ product.name }}</h4>
        <p class="text-sm text-zinc-600 line-clamp-2 mt-2">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getFullMediaUrl } from '../../api';
import { Play } from 'lucide-vue-next';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const props = defineProps({
  settings: { type: Object, required: true },
  products: { type: Array, default: () => [] },
  presentation: { type: Object, default: null },
});

const videoStore = useVideoPlayerStore();

const presentationVideoSrc = computed(() => {
  if (props.presentation?.media) {
    return getFullMediaUrl(props.presentation.media);
  }

  return props.settings['product_video'] || props.settings['video_url'] || '';
});

const previewImage = computed(() => {
  if (props.presentation?.media?.thumbnailPath) return getFullMediaUrl(props.presentation.media.thumbnailPath);
  return props.settings['presentation_cover_image'] ? getFullMediaUrl(props.settings['presentation_cover_image']) : '';
});

const openVideo = () => {
  if (presentationVideoSrc.value) {
    videoStore.open({
      src: presentationVideoSrc.value,
      title: props.presentation?.title || 'Product Catalog Presentation',
      thumbnail: previewImage.value || null,
    });
  }
};
</script>
