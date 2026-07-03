<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <div class="space-y-4">
      <h2 class="text-4xl sm:text-5xl font-display font-black text-accent">Business Plan Video Overview</h2>
      <p class="text-sm sm:text-base text-zinc-600 leading-relaxed">
        You’ve completed the text presentation. Now watch the business plan video to see the full system, the launch story and the team-building path in one complete view.
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
        <p class="text-sm uppercase tracking-[0.35em] text-white/70 mb-3">Business Plan Presentation</p>
        <h3 class="text-2xl sm:text-3xl font-black text-white mb-4">{{ titleText }}</h3>
        <p v-if="presentation?.description" class="max-w-2xl text-sm text-white/75 mb-6">{{ presentation.description }}</p>
        <button
          type="button"
          @click="openVideo"
          :disabled="!presentationVideoSrc"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-accent-light transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size="18" class="text-zinc-900" />
          Watch business plan video
        </button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="p-5 bg-white border border-zinc-200 rounded-3xl shadow-sm">
        <p class="text-sm font-semibold text-zinc-900 mb-3">What this slide does</p>
        <ul class="space-y-2 text-sm text-zinc-600 list-disc list-inside">
          <li>Confirm the written presentation is complete.</li>
          <li>Switch focus to the video business plan for delivery.</li>
          <li>See how the model works as a single pitch with your audience.</li>
        </ul>
      </div>
      <div class="p-5 bg-zinc-950/95 border border-zinc-800 rounded-3xl text-white">
        <p class="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-3">Why watch it now?</p>
        <p class="text-sm leading-relaxed">
          The text slides have laid out the story. This video ties the plan, the product, and the compensation system together so you can present with confidence.
        </p>
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
  return props.settings['video_url'] || '';
});

const previewImage = computed(() => {
  if (props.presentation?.thumbnail) return getFullMediaUrl(props.presentation.thumbnail);
  return props.settings['presentation_cover_image'] ? getFullMediaUrl(props.settings['presentation_cover_image']) : '';
});

const titleText = computed(() => props.presentation?.title || 'Business Plan Presentation');

const openVideo = () => {
  if (!presentationVideoSrc.value) return;
  videoStore.open({ src: presentationVideoSrc.value, title: titleText.value });
};
</script>
