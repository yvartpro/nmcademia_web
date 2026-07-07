<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-4">
      <h2 class="text-4xl sm:text-5xl font-display font-black text-accent">Business Plan Video Overview</h2>
      <p class="text-base sm:text-lg text-zinc-600 leading-relaxed">
        You’ve completed the written overview. Watch the business plan video to see how the full system, the launch story, and the team-building path connect in one clear journey.
      </p>
    </div>

    <div class="aspect-video rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-glow relative">
      <img
        v-if="previewImage"
        :src="previewImage"
        alt="Business plan preview"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/35"></div>

      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <button
          type="button"
          @click="openVideo"
          :disabled="!presentationVideoSrc"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-bold text-zinc-50 hover:text-zinc-500 hover:bg-accent-light transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size="18" class="hover:text-zinc-900" />
          Watch business plan video
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Play } from 'lucide-vue-next';
import { getFullMediaUrl } from '../../api';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const videoStore = useVideoPlayerStore();

const props = defineProps({
  presentation: { type: Object, default: null },
  settings: { type: Object, required: true },
});

const presentationVideoSrc = computed(() => {
  if (props.presentation?.media) return getFullMediaUrl(props.presentation.media);
  return props.settings['product_video'] || props.settings['video_url'] || '';
});

const previewImage = computed(() => {
  if (props.presentation?.media?.thumbnailPath) return getFullMediaUrl(props.presentation.media.thumbnailPath);
  return props.settings['presentation_cover_image'] ? getFullMediaUrl(props.settings['presentation_cover_image']) : '';
});

const titleText = computed(() => props.presentation?.title || 'Business Plan Presentation');

const openVideo = () => {
  if (!presentationVideoSrc.value) return;
  videoStore.open({
    src: presentationVideoSrc.value,
    title: titleText.value,
    thumbnail: previewImage.value || null,
  });
};
</script>
