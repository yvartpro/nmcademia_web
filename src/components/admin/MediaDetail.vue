<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="asset"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Scrim -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                :class="asset.type === 'video'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-emerald-100 text-emerald-700'"
              >
                {{ asset.type }}
              </span>
              <h2 class="text-sm font-bold text-zinc-800 truncate" :title="asset.title">
                {{ asset.title || 'Untitled' }}
              </h2>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="shrink-0 ml-3 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              aria-label="Close"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto nma-scrollbar">
            <div class="flex flex-col md:flex-row gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100">

              <!-- Preview pane -->
              <div class="md:w-72 shrink-0 bg-zinc-50 flex flex-col items-center justify-center p-4 gap-3">

                <!-- IMAGE preview -->
                <template v-if="asset.type === 'image'">
                  <img
                    :src="resolvedFileUrl"
                    :alt="asset.title"
                    class="max-w-full max-h-56 object-contain rounded-lg shadow"
                    @error="previewBroken = true"
                  />
                  <p v-if="previewBroken" class="text-xs text-red-500">Preview unavailable</p>
                </template>

                <!-- VIDEO preview -->
                <template v-else>
                  <!-- Show video player when activated, else thumbnail -->
                  <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow">
                    <video
                      v-if="videoActive"
                      ref="videoRef"
                      :src="isHlsAsset ? undefined : resolvedFileUrl"
                      class="w-full h-full object-contain"
                      controls
                      autoplay
                      playsinline
                    />
                    <template v-else>
                      <img
                        v-if="resolvedThumbnailUrl"
                        :src="resolvedThumbnailUrl"
                        :alt="asset.title"
                        class="w-full h-full object-cover"
                        @error="thumbBroken = true"
                      />
                      <div
                        v-if="!resolvedThumbnailUrl || thumbBroken"
                        class="w-full h-full flex items-center justify-center bg-zinc-800"
                      >
                        <svg class="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"/>
                        </svg>
                      </div>
                      <!-- Play button overlay -->
                      <button
                        type="button"
                        @click="videoActive = true"
                        class="absolute inset-0 flex items-center justify-center group"
                        aria-label="Play video"
                      >
                        <div class="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-xl ring-2 ring-white/30 transition-transform duration-200 group-hover:scale-110 group-hover:bg-black/80">
                          <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </button>
                    </template>
                  </div>

                  <!-- Thumbnail section for video -->
                  <div class="w-full">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Thumbnail</span>
                      <label
                        class="cursor-pointer text-[10px] font-bold text-[#008A20] hover:text-[#006616] transition flex items-center gap-1"
                        :class="{ 'opacity-50 pointer-events-none': mediaStore.uploading }"
                      >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                        {{ mediaStore.uploading ? 'Uploading…' : 'Change' }}
                        <input type="file" accept="image/*" class="hidden" @change="changeThumbnail" :disabled="mediaStore.uploading" />
                      </label>
                    </div>
                    <div
                      v-if="resolvedThumbnailUrl && !thumbBroken"
                      class="w-full aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100"
                    >
                      <img :src="resolvedThumbnailUrl" :alt="'Thumbnail for ' + asset.title" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-full aspect-video rounded-lg border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 text-[11px]">
                      No thumbnail
                    </div>
                  </div>
                </template>
              </div>

              <!-- Info + actions pane -->
              <div class="flex-1 p-5 space-y-5">

                <!-- File info -->
                <div class="space-y-2">
                  <h3 class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">File info</h3>
                  <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div v-if="asset.fileSize">
                      <dt class="text-zinc-400 font-medium">Size</dt>
                      <dd class="text-zinc-700 font-semibold">{{ humanFileSize(asset.fileSize) }}</dd>
                    </div>
                    <div v-if="asset.mimeType">
                      <dt class="text-zinc-400 font-medium">Format</dt>
                      <dd class="text-zinc-700 font-semibold font-mono text-[10px]">{{ asset.mimeType }}</dd>
                    </div>
                    <div v-if="asset.width && asset.height">
                      <dt class="text-zinc-400 font-medium">Dimensions</dt>
                      <dd class="text-zinc-700 font-semibold">{{ asset.width }} × {{ asset.height }}</dd>
                    </div>
                    <div>
                      <dt class="text-zinc-400 font-medium">ID</dt>
                      <dd class="text-zinc-700 font-semibold">#{{ asset.id }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- URLs -->
                <div class="space-y-2">
                  <h3 class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">URLs</h3>

                  <!-- File URL -->
                  <div class="space-y-1">
                    <p class="text-[10px] text-zinc-400 font-medium">
                      {{ asset.type === 'video' ? 'Video URL' : 'Image URL' }}
                    </p>
                    <div class="flex items-center gap-2">
                      <input
                        readonly
                        :value="resolvedFileUrl"
                        class="flex-1 text-[10px] font-mono bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-600 truncate focus:outline-none focus:ring-1 focus:ring-[#008A20]/30"
                        @click="$event.target.select()"
                      />
                      <button
                        type="button"
                        @click="copy(resolvedFileUrl, 'fileUrl')"
                        class="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition border"
                        :class="copied === 'fileUrl'
                          ? 'bg-[#008A20] text-white border-[#008A20]'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#008A20]/40 hover:text-[#008A20]'"
                      >
                        {{ copied === 'fileUrl' ? '✓ Copied' : 'Copy' }}
                      </button>
                    </div>
                  </div>

                  <!-- Thumbnail URL (video only) -->
                  <div v-if="asset.type === 'video'" class="space-y-1">
                    <p class="text-[10px] text-zinc-400 font-medium">Thumbnail URL</p>
                    <div class="flex items-center gap-2">
                      <input
                        readonly
                        :value="resolvedThumbnailUrl || '—'"
                        class="flex-1 text-[10px] font-mono bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-600 truncate focus:outline-none focus:ring-1 focus:ring-[#008A20]/30"
                        :class="{ 'text-zinc-300': !resolvedThumbnailUrl }"
                        @click="$event.target.select()"
                      />
                      <button
                        type="button"
                        @click="copy(resolvedThumbnailUrl, 'thumbUrl')"
                        :disabled="!resolvedThumbnailUrl"
                        class="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition border"
                        :class="copied === 'thumbUrl'
                          ? 'bg-[#008A20] text-white border-[#008A20]'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#008A20]/40 hover:text-[#008A20] disabled:opacity-40 disabled:pointer-events-none'"
                      >
                        {{ copied === 'thumbUrl' ? '✓ Copied' : 'Copy' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Danger zone -->
                <div class="pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    @click="confirmDelete"
                    class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 transition"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                    Delete this file
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Toast -->
          <Transition name="toast">
            <div
              v-if="toast"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none"
            >
              {{ toast }}
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import Hls from 'hls.js';
import { useMediaStore } from '../../stores/media';

const props = defineProps({
  asset: { type: Object, default: null }
});

const emit = defineEmits(['close', 'deleted', 'updated']);

const mediaStore = useMediaStore();
const videoActive = ref(false);
const previewBroken = ref(false);
const thumbBroken = ref(false);
const videoRef = ref(null);
let hlsInstance = null;
const copied = ref(null);
const toast = ref('');
let toastTimer = null;
let copiedTimer = null;

// Reset state when asset changes
watch(() => props.asset, async () => {
  videoActive.value = false;
  previewBroken.value = false;
  thumbBroken.value = false;
  copied.value = null;
  if (hlsInstance) {
    try { hlsInstance.destroy(); } catch (_) {}
    hlsInstance = null;
  }
  await nextTick();
});

watch(videoActive, async (isActive) => {
  if (!isActive || !props.asset || !isHlsAsset.value) return;
  await nextTick();
  const video = videoRef.value;
  if (!video) return;
  if (hlsInstance) {
    try { hlsInstance.destroy(); } catch (_) {}
    hlsInstance = null;
  }
  if (Hls.isSupported()) {
    hlsInstance = new Hls({ maxBufferLength: 6 });
    hlsInstance.loadSource(resolvedFileUrl.value);
    hlsInstance.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = resolvedFileUrl.value;
  }
});

const resolvedFileUrl = computed(() => {
  if (!props.asset) return '';
  return mediaStore.getCopyUrl(props.asset);
});

const isHlsAsset = computed(() => {
  const filePath = props.asset?.filePath || '';
  return props.asset?.streamType === 'hls' || props.asset?.versions?.stream?.streamType === 'hls' || filePath.endsWith('.m3u8');
});

const resolvedThumbnailUrl = computed(() => {
  if (!props.asset?.thumbnailPath) return '';
  return mediaStore.resolveUrl(props.asset.thumbnailPath);
});

const humanFileSize = (size) => {
  if (!size) return '—';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

const showToast = (msg) => {
  toast.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.value = ''; }, 2200);
};

const copy = async (url, key) => {
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  copied.value = key;
  showToast('Copied to clipboard!');
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => { copied.value = null; }, 2200);
};

const changeThumbnail = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !props.asset) return;
  e.target.value = '';
  try {
    thumbBroken.value = false;
    const updated = await mediaStore.updateThumbnail(props.asset.id, file);
    emit('updated', updated);
    showToast('Thumbnail updated!');
  } catch (err) {
    console.error(err);
    showToast('Failed to update thumbnail');
  }
};

const confirmDelete = async () => {
  if (!props.asset) return;
  if (!confirm(`Delete "${props.asset.title || 'this file'}"?\n\nContent using it may show broken media.`)) return;
  try {
    await mediaStore.deleteAsset(props.asset.id);
    emit('deleted', props.asset.id);
    emit('close');
  } catch (err) {
    console.error(err);
    showToast('Delete failed');
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
}
.modal-leave-to .relative {
  transform: scale(0.96) translateY(4px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
</style>
