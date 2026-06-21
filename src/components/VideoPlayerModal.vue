<template>
  <div v-if="visible" class="fixed inset-0 z-[200] bg-black flex items-center justify-center">

    <!-- Top bar -->
    <div class="absolute top-0 left-0 right-0 flex items-center justify-between p-4 text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
      <span class="text-sm font-semibold truncate max-w-[70%]">{{ title }}</span>

      <button
        @click="close"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        ✕
      </button>
    </div>

    <!-- Video container (letterboxed, responsive) -->
    <div class="w-full h-full flex items-center justify-center p-4">
      <video
        ref="videoRef"
        class="max-w-full max-h-full w-auto h-auto bg-black"
        controls
        autoplay
        playsinline
        :src="src"
      />
    </div>

  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useVideoPlayerStore } from '@/stores/videoPlayer';

  const store = useVideoPlayerStore();

  const visible = computed(() => store.visible);
  const src = computed(() => store.src);
  const title = computed(() => store.title);

  const videoRef = ref(null);

  const close = () => store.close();

  watch(() => store.visible, (v) => {
    if (!v && videoRef.value) {
      videoRef.value.pause();
      videoRef.value.currentTime = 0;
    }
  });
</script>