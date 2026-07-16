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
  const thumbnail = ref(null);
  const asset = ref(null);
  const isBuffering = ref(true);
  const bufferProgress = ref(0);
  const currentQuality = ref('auto');

  // Per-video resume positions: { [srcKey]: seconds }
  const positions = ref(loadPositions());

  const resolveUrl = (assetOrPath) => getFullMediaUrl(assetOrPath);

  const resolvePreferredQuality = () => {
    if (typeof window === 'undefined') return 'auto';
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = conn?.effectiveType || '';
    const downlink = Number(conn?.downlink || 0);
    if (conn?.saveData) return '360';
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink <= 1.5) return '360';
    if (effectiveType === '3g' || downlink <= 3) return '360';
    return '720';
  };

  /** The saved resume position for the currently open video */
  const resumeAt = computed(() => {
    if (!src.value) return 0;
    return positions.value[src.value] || 0;
  });

  function open({ src: videoSrc, title: videoTitle = '', thumbnail: videoThumbnail = null, asset: videoAsset = null }) {
    src.value = videoSrc;
    title.value = videoTitle;
    thumbnail.value = videoThumbnail;
    asset.value = videoAsset;
    currentQuality.value = resolvePreferredQuality();
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
    thumbnail.value = null;
    asset.value = null;
    currentQuality.value = 'auto';
  }

  function close() {
    visible.value = false;
    src.value = null;
    title.value = '';
    thumbnail.value = null;
    asset.value = null;
    currentQuality.value = 'auto';
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

  function setPlaybackQuality(quality) {
    currentQuality.value = quality;
  }

  return {
    visible,
    src,
    title,
    thumbnail,
    asset,
    isBuffering,
    bufferProgress,
    currentQuality,
    resumeAt,
    resolveUrl,
    open,
    close,
    closeAt,
    savePosition,
    setBuffering,
    setBufferProgress,
    setPlaybackQuality,
  };
});