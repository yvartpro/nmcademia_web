<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-zinc-500 uppercase tracking-wider font-bold text-[10px]"
    >
      {{ label }}
    </label>

    <!-- Selected asset -->
    <div
      v-if="selectedAsset"
      class="flex items-center gap-3 p-2 bg-[#F4F6F5] border border-zinc-200 rounded-lg"
    >
      <template v-if="selectedAsset.type === 'image' || (selectedAsset.type === 'video' && selectedAsset.thumbnailPath)">
        <img
          :src="previewUrl(selectedAsset)"
          :alt="selectedAsset.title"
          class="w-14 h-14 object-cover rounded border border-zinc-200"
        />
      </template>
      <div
        v-else
        class="w-14 h-14 rounded bg-zinc-200 flex items-center justify-center text-lg"
      >
        🎬
      </div>

      <div class="flex-grow min-w-0">
        <p class="text-[#0A0F0D] font-medium truncate text-xs">
          {{ selectedAsset.title || `Asset #${selectedAsset.id}` }}
        </p>

        <p
          class="text-zinc-400 text-[10px] truncate"
          :title="mediaStore.getCopyUrl(selectedAsset)"
        >
          {{ mediaStore.getCopyUrl(selectedAsset) }}
        </p>
      </div>

      <button
        type="button"
        @click="clear"
        class="text-red-500 hover:text-red-700 text-xs font-bold shrink-0"
      >
        Clear
      </button>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-2">

      <!-- Upload Image -->
      <label
        v-if="assetType === 'image' || assetType === 'all'"
        class="cursor-pointer bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-[#008A20] font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ mediaStore.uploading ? 'Uploading…' : 'Upload image' }}

        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onUpload('image', $event)"
        />
      </label>

      <!-- Upload Video (select then optionally thumbnail) -->
      <label v-if="assetType === 'video' || assetType === 'all'" class="cursor-pointer bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-[#008A20] font-bold px-3 py-1.5 rounded text-[10px] transition">
        Select video
        <input type="file" accept="video/*" class="hidden" @change="onSelectVideo" />
      </label>

      <button
        v-if="props.showLibraryToggle"
        type="button"
        @click="showLibrary = !showLibrary"
        class="bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-zinc-600 font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ showLibrary ? 'Hide library' : 'Pick from library' }}
      </button>
    </div>

    <!-- Video upload staging area: choose thumbnail and show progress -->
    <div v-if="tempVideoFile" class="mt-4 p-4 border-2 border-[#008A20] rounded-lg bg-[#F4F6F5]">
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 bg-white rounded flex items-center justify-center flex-shrink-0">🎬</div>
        <div class="flex-1">
          <div class="text-sm font-bold text-[#008A20]">{{ tempVideoFile.name }}</div>
          <div class="text-[11px] text-zinc-500">Size: {{ humanFileSize(tempVideoFile.size) }}</div>

          <div class="mt-3 p-3 bg-white rounded border border-zinc-200">
            <label class="block text-[11px] font-semibold text-zinc-700 mb-2">📷 Add thumbnail (required)</label>
            <label class="inline-block cursor-pointer bg-[#008A20] hover:bg-[#006616] text-white px-3 py-1.5 rounded text-[10px] font-bold transition">
              Choose image
              <input type="file" accept="image/*" @change="onSelectThumbnail" class="hidden" />
            </label>
            <div v-if="tempThumbnailFile" class="text-[11px] mt-2 p-2 bg-green-50 border border-green-200 rounded">
              ✓ Selected: <strong>{{ tempThumbnailFile.name }}</strong> ({{ humanFileSize(tempThumbnailFile.size) }})
            </div>
          </div>

          <div class="mt-3 flex gap-2">
            <button @click="startUpload" type="button" :disabled="uploading || !tempThumbnailFile" class="bg-[#008A20] hover:bg-[#006616] text-white font-bold px-4 py-2 rounded text-[11px] transition disabled:opacity-50">
              {{ uploading ? 'Uploading…' : '↑ Start upload' }}
            </button>
            <button @click="resetStaging" type="button" :disabled="uploading" class="px-3 py-2 border border-zinc-300 rounded text-[11px] text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              Cancel
            </button>
          </div>

          <div v-if="uploading" class="mt-3 space-y-2">
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

    <!-- Library -->
    <div
      v-if="props.showLibraryToggle && showLibrary"
      class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-[#F4F6F5] border border-zinc-200 rounded-lg custom-scrollbar"
    >
      <button
        v-for="asset in filteredAssets"
        :key="asset.id"
        type="button"
        @click="select(asset)"
        :class="[
          'aspect-square rounded border overflow-hidden transition',
          modelValue === asset.id
            ? 'border-[#008A20] ring-1 ring-[#008A20]'
            : 'border-zinc-200 hover:border-zinc-400'
        ]"
      >
        <template v-if="asset.type === 'image' || (asset.type === 'video' && asset.thumbnailPath)">
          <img
            :src="previewUrl(asset)"
            :alt="asset.title"
            class="w-full h-full object-cover"
          />
        </template>

        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-zinc-200 text-2xl"
        >
          🎬
        </div>
      </button>

      <p
        v-if="filteredAssets.length === 0"
        class="col-span-full text-center text-zinc-400 text-[10px] py-4"
      >
        No assets found.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMediaStore } from '../../stores/media';

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null
  },

  label: {
    type: String,
    default: 'Media'
  },

  isUrlMode: {
    type: Boolean,
    default: false
  },

  assetType: {
    type: String,
    default: 'image',
    validator: value =>
      ['image', 'video', 'all'].includes(value)
  },

  showLibraryToggle: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const mediaStore = useMediaStore();
const showLibrary = ref(false);

const filteredAssets = computed(() => {
  if (props.assetType === 'all') {
    return mediaStore.assets;
  }

  return mediaStore.assets.filter(
    asset => asset.type === props.assetType
  );
});

const selectedAsset = computed(() => {
  if (!props.modelValue) return null;

  if (!props.isUrlMode) {
    return mediaStore.getById(Number(props.modelValue));
  }

  return mediaStore.assets.find(
    asset =>
      asset.filePath === props.modelValue ||
      asset.publicUrl === props.modelValue ||
      mediaStore.getCopyUrl(asset) === props.modelValue
  );
});

const previewUrl = (asset) => {
  if (!asset) return '';
  if (asset.type === 'video' && asset.thumbnailPath) {
    return mediaStore.resolveUrl(asset.thumbnailPath);
  }
  return mediaStore.resolveUrl(asset);
};

onMounted(() => {
  if (mediaStore.assets.length === 0) {
    mediaStore.fetchAll();
  }
});

watch(
  () => props.modelValue,
  () => {
    if (
      props.modelValue &&
      !selectedAsset.value &&
      mediaStore.assets.length === 0
    ) {
      mediaStore.fetchAll();
    }
  }
);

const select = asset => {
  const value = props.isUrlMode
    ? asset.filePath
    : asset.id;

  emit('update:modelValue', value);
  showLibrary.value = false;
};

const clear = () => {
  emit(
    'update:modelValue',
    props.isUrlMode ? '' : null
  );
};


// Video + optional thumbnail flow
const tempVideoFile = ref(null);
const tempThumbnailFile = ref(null);
const uploading = ref(false);
const videoProgress = ref(0);
const imageProgress = ref(0);
const overallProgress = ref(0);

const humanFileSize = (size) => {
  if (!size) return '0 B';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  return (size / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

const onSelectVideo = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  tempVideoFile.value = file;
  tempThumbnailFile.value = null;
};

const onSelectThumbnail = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  tempThumbnailFile.value = file;
};

const resetStaging = () => {
  tempVideoFile.value = null;
  tempThumbnailFile.value = null;
  uploading.value = false;
  videoProgress.value = 0;
  imageProgress.value = 0;
  overallProgress.value = 0;
};

const startUpload = async () => {
  if (!tempVideoFile.value) return;
  if (!tempThumbnailFile.value) {
    alert('Please select a thumbnail image for this video upload.');
    return;
  }

  uploading.value = true;
  try {
    const asset = await mediaStore.uploadVideoWithThumbnail(
      tempVideoFile.value,
      tempThumbnailFile.value,
      { title: tempVideoFile.value.name, description: '' },
      {
        onVideoProgress: (pct) => { videoProgress.value = pct; },
        onImageProgress: (pct) => { imageProgress.value = pct; },
        onOverall: (pct) => { overallProgress.value = pct; }
      }
    );

    const value = props.isUrlMode ? asset.filePath : asset.id;
    emit('update:modelValue', value);
    showLibrary.value = false;
    resetStaging();
  } catch (err) {
    console.error(err);
    alert('Upload failed. Try again.');
    uploading.value = false;
  }
};

// Fallback single-image or single-video upload for image-type pickers
const onUpload = async (type, e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const asset = type === 'image'
      ? await mediaStore.uploadImage(file, { title: file.name })
      : await mediaStore.uploadVideo(file, { title: file.name });

    const value = props.isUrlMode ? asset.filePath : asset.id;
    emit('update:modelValue', value);
    showLibrary.value = false;
  } catch (err) {
    console.error(err);
    alert('Upload failed. Try again.');
  }

  e.target.value = '';
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f4f6f5;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #008a20;
}
</style>