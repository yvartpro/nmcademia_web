<template>
  <div class="space-y-6">
    <h3 class="text-lg font-bold font-display">Featured Testimonials (Video)</h3>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-white p-4 rounded shadow-sm">
        <div v-if="featured" class="space-y-3">
          <div class="w-full aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
            <video v-if="featured.video && featured.video.filePath" :src="mediaResolve(featured.video.filePath)" controls class="w-full h-full object-cover" />
            <div v-else class="text-white">No video available</div>
          </div>

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

const mediaStore = useMediaStore();
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
