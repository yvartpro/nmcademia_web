<template>
  <div
    v-if="store.visible"
    class="fixed inset-0 z-[200] bg-black flex items-center justify-center"
    @mousemove="triggerControls"
    @touchstart="triggerControls"
  >

    <!-- LOADING OVERLAY -->
    <div
      v-if="store.isBuffering"
      class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
    >
      <div class="flex flex-col items-center gap-4">
        <LoadingDots color="bg-accent" />
        <p class="text-white/70 text-sm font-medium">Buffering...</p>
        <div v-if="store.bufferProgress > 0" class="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-accent transition-all duration-300"
            :style="{ width: store.bufferProgress + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- NATIVE VIDEO -->
    <video
      v-if="!isIframe"
      ref="videoRef"
      class="max-w-full max-h-full w-auto h-auto bg-black rounded-xl shadow-2xl"
      playsinline
      :src="src"
      :poster="thumbnail ?? undefined"
      @contextmenu.prevent
    />

    <!-- IFRAME (YouTube / External) -->
    <template v-else>
      <!-- Thumbnail splash shown until user clicks play -->
      <div
        v-if="showIframeSplash"
        class="relative w-[90vw] h-[90vh] md:w-[80vw] md:h-[80vh] rounded-xl overflow-hidden cursor-pointer group"
        @click="launchIframe"
      >
        <!-- Thumbnail image -->
        <img
          v-if="thumbnail"
          :src="thumbnail"
          alt="Video preview"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div v-else class="absolute inset-0 bg-zinc-900" />

        <!-- Dark scrim + play button -->
        <div class="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/55">
          <div class="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <!-- Play triangle -->
            <svg class="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        <!-- Title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p class="text-white text-sm font-semibold truncate">{{ title }}</p>
        </div>
      </div>

      <!-- Actual iframe, shown after splash is dismissed -->
      <iframe
        v-else
        class="w-[90vw] h-[90vh] md:w-[80vw] md:h-[80vh] bg-black rounded-xl shadow-2xl"
        :src="src"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </template>

    <!-- TOP BAR -->
    <div
      class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300"
      :class="showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <span class="text-sm font-semibold truncate max-w-[70%]">
        {{ title }}
      </span>

      <button
        @click="closePlayer"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        ✕
      </button>
    </div>

    <!-- CONTROLS (Only for Native Video) -->
    <div
      v-if="!isIframe"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-20 bg-black/60 backdrop-blur-xl rounded-2xl p-3 text-white transition-opacity duration-300"
      :class="showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >

      <!-- Progress bar -->
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

        <!-- Play/Pause -->
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

        <!-- Time display -->
        <div class="text-xs text-green-300 font-mono">
          {{ formatTime(progress) }} / {{ formatTime(duration) }}
        </div>

        <!-- Resume badge -->
        <div v-if="showResumeBadge" class="text-[10px] bg-green-500/20 border border-green-500/30 text-green-300 px-2 py-0.5 rounded-full">
          Resumed
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { useVideoPlayerStore } from '@/stores/videoPlayer';
import { getFullMediaUrl } from '@/api';
import LoadingDots from './ui/LoadingDots.vue';

const store = useVideoPlayerStore();

const src = computed(() => store.src);
const title = computed(() => store.title);
const thumbnail = computed(() => store.thumbnail ? getFullMediaUrl(store.thumbnail) : null);

// Iframe splash: shown before the user clicks play (avoids auto-loading the iframe)
const showIframeSplash = ref(true);
const launchIframe = () => { showIframeSplash.value = false; };

const isIframe = computed(() => {
  if (!src.value) return false;
  return src.value.includes('youtube.com') || 
         src.value.includes('youtu.be') || 
         src.value.includes('vimeo.com');
});

const videoRef = ref(null);

// State
const isPlaying = ref(false);
const isMuted = ref(false);
const volume = ref(1);
const progress = ref(0);
const duration = ref(0);
const showResumeBadge = ref(false);

// Controls visibility (auto-hide)
const showControls = ref(true);
let hideTimer = null;
let saveTimer = null;

const triggerControls = () => {
  showControls.value = true;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    showControls.value = false;
  }, 2500);
};

// Format seconds as mm:ss
const formatTime = (secs) => {
  const s = Math.floor(secs || 0);
  const m = Math.floor(s / 60);
  const remaining = s % 60;
  return `${m}:${remaining.toString().padStart(2, '0')}`;
};

// Core controls
const togglePlay = () => {
  const video = videoRef.value;
  if (!video) return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
    // Save position on manual pause
    store.savePosition(video.currentTime, video.duration);
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
  const video = videoRef.value;
  if (!video) return;
  const time = Number(e.target.value);
  video.currentTime = time;
  progress.value = time;
  store.savePosition(time, video.duration);
};

// Sync progress from video element
const onTimeUpdate = () => {
  const video = videoRef.value;
  if (!video) return;
  progress.value = video.currentTime;
  duration.value = video.duration || 0;
};

const onLoaded = async () => {
  const video = videoRef.value;
  if (!video) return;
  duration.value = video.duration || 0;

  // Restore saved position
  const resumeAt = store.resumeAt;
  if (resumeAt > 0) {
    video.currentTime = resumeAt;
    progress.value = resumeAt;
    showResumeBadge.value = true;
    setTimeout(() => { showResumeBadge.value = false; }, 3000);
  }

  // Start playing after seek
  video.play().then(() => {
    isPlaying.value = true;
  }).catch(() => {
    isPlaying.value = false;
  });
};

const onEnded = () => {
  isPlaying.value = false;
  // Clear resume point — video completed
  store.savePosition(duration.value, duration.value);
};

// Close: save position first
const closePlayer = () => {
  const video = videoRef.value;
  if (video) {
    store.closeAt(video.currentTime, video.duration);
  } else {
    store.close();
  }
};

// Periodic position save while playing (every 5 seconds)
const startSaveTimer = () => {
  clearInterval(saveTimer);
  saveTimer = setInterval(() => {
    const video = videoRef.value;
    if (video && !video.paused && !video.ended) {
      store.savePosition(video.currentTime, video.duration);
    }
  }, 5000);
};

const stopSaveTimer = () => clearInterval(saveTimer);

// Watch src changes to re-initialize player
watch(src, async (newSrc) => {
  // Reset iframe splash whenever a new video is opened
  showIframeSplash.value = true;
  if (!newSrc) return;
  stopSaveTimer();
  await nextTick();

  const video = videoRef.value;
  if (!video) return;

  // Reset state
  progress.value = 0;
  duration.value = 0;
  isPlaying.value = false;
  showResumeBadge.value = false;

  video.load();
  // onLoaded will handle resume + autoplay

  // Attach event listeners
  video.addEventListener('timeupdate', onTimeUpdate);
  video.addEventListener('loadedmetadata', onLoaded);
  video.addEventListener('ended', onEnded);
  video.addEventListener('play', () => {
    isPlaying.value = true;
    startSaveTimer();
  });
  video.addEventListener('pause', () => {
    isPlaying.value = false;
    stopSaveTimer();
  });
  
  // Buffer event handlers
  video.addEventListener('waiting', () => {
    store.setBuffering(true);
  });
  video.addEventListener('canplay', () => {
    store.setBuffering(false);
  });
  video.addEventListener('canplaythrough', () => {
    store.setBuffering(false);
  });
  video.addEventListener('progress', () => {
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percentage = (bufferedEnd / video.duration) * 100;
      store.setBufferProgress(percentage);
    }
  });
}, { immediate: true });
</script>