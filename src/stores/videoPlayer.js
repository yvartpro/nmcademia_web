import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFullMediaUrl } from '../api';

const STORAGE_KEY = 'nma_video_positions';

function loadPositions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function savePositions(positions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {}
}

export const useVideoPlayerStore = defineStore('videoPlayer', () => {
  const visible = ref(false);
  const src = ref(null);
  const title = ref('');
  const isBuffering = ref(false);
  const bufferProgress = ref(0);

  // Per-video resume positions: { [srcKey]: seconds }
  const positions = ref(loadPositions());

  const resolveUrl = (assetOrPath) => getFullMediaUrl(assetOrPath);

  /** The saved resume position for the currently open video */
  const resumeAt = computed(() => {
    if (!src.value) return 0;
    return positions.value[src.value] || 0;
  });

  function open({ src: videoSrc, title: videoTitle = '' }) {
    src.value = videoSrc;
    title.value = videoTitle;
    visible.value = true;
  }

  /**
   * Called by the player as the video plays.
   * Saves the current position so it can be restored later.
   * Does NOT save when the video is essentially finished (last 3 seconds).
   */
  function savePosition(seconds, totalDuration) {
    if (!src.value) return;
    const isFinished = totalDuration > 0 && seconds >= totalDuration - 3;
    if (isFinished) {
      // Clear resume point — video was completed
      const next = { ...positions.value };
      delete next[src.value];
      positions.value = next;
    } else {
      positions.value = { ...positions.value, [src.value]: seconds };
    }
    savePositions(positions.value);
  }

  /**
   * Called when user manually closes the player.
   * Saves the current position passed in from the component.
   */
  function closeAt(seconds, totalDuration) {
    savePosition(seconds, totalDuration);
    visible.value = false;
    src.value = null;
    title.value = '';
  }

  function close() {
    visible.value = false;
    src.value = null;
    title.value = '';
  }

  function setBuffering(buffering) {
    isBuffering.value = buffering;
    if (!buffering) {
      bufferProgress.value = 0;
    }
  }

  function setBufferProgress(progress) {
    bufferProgress.value = Math.min(100, Math.max(0, progress));
  }

  return {
    visible,
    src,
    title,
    isBuffering,
    bufferProgress,
    resumeAt,
    resolveUrl,
    open,
    close,
    closeAt,
    savePosition,
    setBuffering,
    setBufferProgress,
  };
});