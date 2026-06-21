<template>
  <div
    v-if="store.visible"
    class="fixed inset-0 z-[200] bg-black flex items-center justify-center"
    @mousemove="triggerControls"
    @touchstart="triggerControls"
  >

    <!-- VIDEO -->
    <video
      ref="videoRef"
      class="max-w-full max-h-full w-auto h-auto bg-black rounded-xl shadow-2xl"
      autoplay
      playsinline
      :src="src"
      @contextmenu.prevent
    />

    <!-- TOP BAR -->
    <div
      class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300"
      :class="showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <span class="text-sm font-semibold truncate max-w-[70%]">
        {{ title }}
      </span>

      <button
        @click="close"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        ✕
      </button>
    </div>

    <!-- CONTROLS -->
    <div
      class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-20 bg-black/60 backdrop-blur-xl rounded-2xl p-3 text-white transition-opacity duration-300"
      :class="showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >

      <!-- Progress -->
      <input
        type="range"
        class="w-full accent-green-500"
        min="0"
        :max="duration"
        step="0.1"
        v-model="progress"
        @input="seek"
      />

      <!-- Controls row -->
      <div class="flex items-center justify-between mt-2">

        <!-- Play -->
        <button @click="togglePlay" class="text-green-400 hover:text-green-300 font-semibold">
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>

        <!-- Mute -->
        <button @click="toggleMute" class="text-green-400 hover:text-green-300 font-semibold">
          {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>

        <!-- Volume -->
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="updateVolume"
          class="w-24 accent-green-500"
        />

        <!-- Time -->
        <div class="text-xs text-green-300 font-mono">
          {{ Math.floor(progress) }} / {{ Math.floor(duration) }} sec
        </div>

        <!-- Exit -->
        <button
          @click="close"
          class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg font-semibold text-white transition"
        >
          Exit
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const store = useVideoPlayerStore();

const src = computed(() => store.src);
const title = computed(() => store.title);

const videoRef = ref(null);

// state
const isPlaying = ref(false);
const isMuted = ref(false);
const volume = ref(1);
const progress = ref(0);
const duration = ref(0);

// controls visibility (auto-hide system)
const showControls = ref(true);
let hideTimer = null;

const triggerControls = () => {
  showControls.value = true;

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    showControls.value = false;
  }, 2500);
};

// core controls
const togglePlay = () => {
  const video = videoRef.value;
  if (!video) return;

  if (video.paused) {
    video.play();
    isPlaying.value = true;
  } else {
    video.pause();
    isPlaying.value = false;
  }

  triggerControls();
};

const toggleMute = () => {
  const video = videoRef.value;
  if (!video) return;

  video.muted = !video.muted;
  isMuted.value = video.muted;

  triggerControls();
};

const updateVolume = (e) => {
  const v = Number(e.target.value);
  volume.value = v;
  if (videoRef.value) videoRef.value.volume = v;

  triggerControls();
};

const seek = (e) => {
  const time = Number(e.target.value);
  if (videoRef.value) videoRef.value.currentTime = time;

  triggerControls();
};

// sync
const onTimeUpdate = () => {
  const video = videoRef.value;
  if (!video) return;

  progress.value = video.currentTime;
  duration.value = video.duration || 0;
};

const onLoaded = () => {
  const video = videoRef.value;
  if (!video) return;

  duration.value = video.duration || 0;
};

// lifecycle
onMounted(() => {
  const video = videoRef.value;
  if (!video) return;

  video.addEventListener('timeupdate', onTimeUpdate);
  video.addEventListener('loadedmetadata', onLoaded);
});

onUnmounted(() => {
  clearTimeout(hideTimer);
});

// store close
const close = () => store.close();

// reset on close
watch(() => store.visible, (v) => {
  if (!v && videoRef.value) {
    videoRef.value.pause();
    videoRef.value.currentTime = 0;
  }
});
</script>