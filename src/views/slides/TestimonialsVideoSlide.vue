<template>
  <div class="space-y-6">
    <h3 class="text-lg font-bold font-display">Featured Testimonials (Video)</h3>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-white p-4 rounded shadow-sm">
        <div v-if="featured" class="space-y-3">
          <div
            v-if="featured.video && featured.video.filePath"
            @click="openVideo(featured)"
            class="w-full aspect-video bg-black rounded overflow-hidden flex items-center justify-center relative cursor-pointer group"
          >
            <img
              v-if="featured.video.thumbnailPath"
              :src="mediaResolve(featured.video.thumbnailPath)"
              alt="Video thumbnail"
              class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div v-else class="absolute inset-0 bg-zinc-900"></div>
            
            <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
              <Play :size="28" class="text-white ml-1" />
            </div>
          </div>
          <div v-else class="w-full aspect-video bg-black rounded overflow-hidden flex items-center justify-center text-white">No video available</div>

          <div>
            <h4 class="text-xl font-extrabold">{{ featured.name }}</h4>
            <p class="text-sm text-zinc-600 mt-1">{{ featured.quote }}</p>
          </div>
        </div>
        <div v-else class="p-8 text-center text-zinc-400">No featured testimonial with video.</div>
      </div>

      <div class="bg-white p-4 rounded shadow-sm">
        <h5 class="text-sm font-bold mb-3">Other videos</h5>
        <div class="space-y-3">
          <button v-for="t in others" :key="t.id" @click="select(t)" class="w-full flex items-center gap-3 p-2 rounded hover:bg-zinc-50 text-left">
            <img v-if="t.video && t.video.thumbnailPath" :src="mediaResolve(t.video.thumbnailPath)" class="w-16 h-12 object-cover rounded" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold truncate">{{ t.name }}</div>
              <div class="text-[12px] text-zinc-500 truncate">{{ t.lifestyleTag }} — {{ t.quote }}</div>
            </div>
          </button>
          <div v-if="others.length === 0" class="text-zinc-400 text-sm">No other video testimonials.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMediaStore } from '../../stores/media';
import { useContentStore } from '../../stores/content';
import { Play } from 'lucide-vue-next';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const mediaStore = useMediaStore();
const videoStore = useVideoPlayerStore();

const openVideo = (testimonial) => {
  if (testimonial.video && testimonial.video.filePath) {
    videoStore.open({
      src: mediaStore.resolveUrl(testimonial.video.filePath),
      title: testimonial.name,
      thumbnail: testimonial.video.thumbnailPath ? mediaStore.resolveUrl(testimonial.video.thumbnailPath) : null,
    });
  }
};
const contentStore = useContentStore();

const videoTestimonials = computed(() => (contentStore.testimonials || []).filter(t => t.hasVideo || (t.video && t.video.filePath)));

const featured = ref(null);

const others = computed(() => (videoTestimonials.value || []).filter(t => !featured.value || t.id !== featured.value.id));

// keep featured in sync when testimonials load
if (videoTestimonials.value && videoTestimonials.value.length > 0) {
  featured.value = videoTestimonials.value[0];
}

const select = (t) => {
  featured.value = t;
};

const mediaResolve = (path) => mediaStore.resolveUrl(path);
</script>

<style scoped>
.aspect-video { aspect-ratio: 16/9; }
</style>
