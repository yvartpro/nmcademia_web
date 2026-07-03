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
      <img
        v-if="selectedAsset.type === 'image'"
        :src="mediaStore.resolveUrl(selectedAsset)"
        :alt="selectedAsset.title"
        class="w-14 h-14 object-cover rounded border border-zinc-200"
      />

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
      <div v-if="assetType === 'video' || assetType === 'all'" class="flex items-center gap-2">
        <label class="cursor-pointer bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-[#008A20] font-bold px-3 py-1.5 rounded text-[10px] transition">
          Select video
          <input type="file" accept="video/*" class="hidden" @change="onSelectVideo" />
        </label>

        <button v-if="tempVideoFile" @click="startUpload" class="bg-[#008A20] text-white px-3 py-1.5 rounded text-[10px]">
          {{ uploading ? 'Uploading…' : 'Start upload' }}
        </button>
      </div>

      <button
        type="button"
        @click="showLibrary = !showLibrary"
        class="bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-zinc-600 font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ showLibrary ? 'Hide library' : 'Pick from library' }}
      </button>
    </div>

    <!-- Video upload staging area: choose thumbnail and show progress -->
    <div v-if="tempVideoFile" class="mt-3 p-3 border border-zinc-200 rounded-lg bg-white">
      <div class="flex items-start gap-3">
        <div class="w-20 h-20 bg-zinc-100 rounded flex items-center justify-center">🎬</div>
        <div class="flex-1">
          <div class="text-sm font-medium">{{ tempVideoFile.name }}</div>
          <div class="text-[11px] text-zinc-500">Size: {{ humanFileSize(tempVideoFile.size) }}</div>

          <div class="mt-2">
            <label class="block text-[11px] text-zinc-600 mb-1">Optional thumbnail</label>
            <input type="file" accept="image/*" @change="onSelectThumbnail" />
            <div v-if="tempThumbnailFile" class="text-[11px] mt-1">Selected: {{ tempThumbnailFile.name }} ({{ humanFileSize(tempThumbnailFile.size) }})</div>
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
      v-if="showLibrary"
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
        <img
          v-if="asset.type === 'image'"
          :src="mediaStore.resolveUrl(asset)"
          :alt="asset.title"
          class="w-full h-full object-cover"
        />

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