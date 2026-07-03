<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-base font-bold text-[#008A20] font-display uppercase tracking-wider">Media Library</h3>
        <p class="text-zinc-500 text-xs mt-1">
          Images are saved once as compressed WebP in <code class="text-[#008A20]/80">uploads/images/</code>.
          Videos go to <code class="text-[#008A20]/80">uploads/videos/</code>.
        </p>
      </div>
      <div class="flex gap-2">
        <MediaPicker
          v-model="selectedMediaId"
          assetType="all"
          label="Upload media"
          :showLibraryToggle="false"
        />
      </div>
    </div>

    <div v-if="pendingVideoFile" class="mt-4 p-4 border-2 border-[#008A20] rounded-lg bg-[#F4F6F5]">
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 bg-white rounded flex items-center justify-center flex-shrink-0">🎬</div>
        <div class="flex-1">
          <div class="text-sm font-bold text-[#008A20]">{{ pendingVideoFile.name }}</div>
          <div class="text-[11px] text-zinc-500">Size: {{ humanFileSize(pendingVideoFile.size) }}</div>

          <div class="mt-3 p-3 bg-white rounded border border-zinc-200">
            <label class="block text-[11px] font-semibold text-zinc-700 mb-2">📷 Add thumbnail (required)</label>
            <label class="inline-block cursor-pointer bg-[#008A20] hover:bg-[#006616] text-white px-3 py-1.5 rounded text-[10px] font-bold transition">
              Choose image
              <input type="file" accept="image/*" @change="onSelectThumbnail" class="hidden" />
            </label>
            <div v-if="pendingThumbnailFile" class="text-[11px] mt-2 p-2 bg-green-50 border border-green-200 rounded">
              ✓ Selected: <strong>{{ pendingThumbnailFile.name }}</strong> ({{ humanFileSize(pendingThumbnailFile.size) }})
            </div>
          </div>

          <div class="mt-3 flex gap-2">
            <button @click="startVideoUpload" type="button" :disabled="mediaStore.uploading || !pendingThumbnailFile" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold px-4 py-2 rounded text-[11px] transition disabled:opacity-50">
              {{ mediaStore.uploading ? 'Uploading…' : 'Upload video' }}
            </button>
            <button @click="resetStaging" type="button" :disabled="mediaStore.uploading" class="px-3 py-2 border border-zinc-300 rounded text-[11px] text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              Cancel
            </button>
          </div>

          <div v-if="mediaStore.uploading" class="mt-3 space-y-2">
            <div>
              <div class="text-[11px]">Image upload: {{ imageProgress }}%</div>
              <div class="w-full bg-zinc-100 rounded h-2 overflow-hidden"><div :style="{width: imageProgress + '%'}" class="h-2 bg-green-500"></div></div>
            </div>
            <div>
              <div class="text-[11px]">Video upload: {{ videoProgress }}%</div>
              <div class="w-full bg-zinc-100 rounded h-2 overflow-hidden"><div :style="{width: videoProgress + '%'}" class="h-2 bg-emerald-600"></div></div>
            </div>
            <div>
              <div class="text-[11px]">Overall: {{ overallProgress }}%</div>
              <div class="w-full bg-zinc-100 rounded h-2 overflow-hidden"><div :style="{width: overallProgress + '%'}" class="h-2 bg-teal-500"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mediaStore.loading" class="text-zinc-400 text-xs">Loading media…</div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="asset in mediaStore.assets"
        :key="asset.id"
        class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm transition"
        :class="{ 'cursor-pointer hover:border-[#008A20]/40 hover:shadow-md': selectable, 'border-[#008A20] ring-2 ring-[#008A20]/30': modelValue === asset.id }"
          @click="handleSelect(asset)"
      >
        <div class="aspect-square bg-[#F4F6F5] relative flex items-center justify-center overflow-hidden">
          <img
            v-if="asset.type === 'image'"
            :src="previewUrl(asset)"
            :alt="asset.title"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="onPreviewError(asset)"
          />
          <video
            v-else
            :src="previewUrl(asset)"
            class="w-full h-full object-cover"
            muted
            playsinline
            preload="metadata"
          />
          <span class="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/80 text-zinc-600 border border-zinc-200">
            {{ asset.type }}
          </span>
          <span
            v-if="brokenPreviews.has(asset.id)"
            class="absolute inset-0 flex items-center justify-center bg-red-50/90 text-red-500 text-[10px] p-2 text-center"
          >
            Preview failed — check SITE_URL / uploads path
          </span>
        </div>
        <div class="p-3 space-y-2">
          <p class="text-[#0A0F0D] text-xs font-bold truncate" :title="asset.title">{{ asset.title || 'Untitled' }}</p>
          <p class="text-zinc-400 text-[9px] font-mono truncate" :title="mediaStore.getCopyUrl(asset)">
            {{ mediaStore.getCopyUrl(asset) }}
          </p>
          <button
            type="button"
            @click.stop="copyUrl(asset)"
            class="w-full text-[10px] text-zinc-600 hover:text-[#008A20] border border-zinc-200 hover:border-[#008A20]/30 rounded py-1.5 transition font-semibold"
          >
            Copy file URL
          </button>
          <button
            type="button"
            @click.stop="handleDelete(asset.id)"
            class="w-full text-[10px] text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 rounded py-1 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-if="!mediaStore.loading && mediaStore.assets.length === 0" class="text-center text-zinc-400 text-sm py-12">
      No media uploaded yet.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMediaStore } from '../../stores/media';
import MediaPicker from './MediaPicker.vue';

const props = defineProps({
  selectable: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [Number, String, null],
    default: null
  }
});

const emit = defineEmits(['select', 'update:modelValue']);

const mediaStore = useMediaStore();
const brokenPreviews = ref(new Set());
const selectedMediaId = ref(null);
const pendingVideoFile = ref(null);
const pendingThumbnailFile = ref(null);
const videoProgress = ref(0);
const imageProgress = ref(0);
const overallProgress = ref(0);

onMounted(() => mediaStore.fetchAll());

const previewUrl = (asset) => {
  if (!asset) return '';
  if (asset.type === 'video' && asset.thumbnailPath) {
    return mediaStore.resolveUrl(asset.thumbnailPath);
  }
  return mediaStore.resolveUrl(asset);
};

const onPreviewError = (asset) => {
  const next = new Set(brokenPreviews.value);
  next.add(asset.id);
  brokenPreviews.value = next;
};

const onSelectVideo = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  pendingVideoFile.value = file;
  pendingThumbnailFile.value = null;
  e.target.value = '';
};

const onSelectThumbnail = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  pendingThumbnailFile.value = file;
  e.target.value = '';
};

const resetStaging = () => {
  pendingVideoFile.value = null;
  pendingThumbnailFile.value = null;
  videoProgress.value = 0;
  imageProgress.value = 0;
  overallProgress.value = 0;
};

const startVideoUpload = async () => {
  if (!pendingVideoFile.value) return;
  if (!pendingThumbnailFile.value) {
    alert('Please select a thumbnail image for this video upload.');
    return;
  }

  try {
    const asset = await mediaStore.uploadVideoWithThumbnail(
      pendingVideoFile.value,
      pendingThumbnailFile.value,
      { title: pendingVideoFile.value.name },
      {
        onVideoProgress: (pct) => { videoProgress.value = pct; },
        onImageProgress: (pct) => { imageProgress.value = pct; },
        onOverall: (pct) => { overallProgress.value = pct; }
      }
    );
    resetStaging();
  } catch {
    alert('Upload failed.');
  }
};

const uploadFile = async (type, e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    if (type === 'image') {
      await mediaStore.uploadImage(file, { title: file.name });
    } else {
      pendingVideoFile.value = file;
      pendingThumbnailFile.value = null;
    }
  } catch {
    alert('Upload failed.');
  }
  e.target.value = '';
};

const handleSelect = (asset) => {
  if (!props.selectable) return;

  emit('select', asset);
  emit('update:modelValue', asset.id);
};

const copyUrl = async (asset) => {
  const url = mediaStore.getCopyUrl(asset);
  try {
    await navigator.clipboard.writeText(url);
    alert('Copied URL to clipboard.');
  } catch {
    prompt('Copy this URL:', url);
  }
};

const handleDelete = async (id) => {
  if (confirm('Delete this media file? Content using it may show broken images.')) {
    await mediaStore.deleteAsset(id);
    const next = new Set(brokenPreviews.value);
    next.delete(id);
    brokenPreviews.value = next;
  }
};
</script>
