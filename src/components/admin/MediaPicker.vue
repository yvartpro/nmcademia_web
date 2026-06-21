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

      <!-- Upload Video -->
      <label
        v-if="assetType === 'video' || assetType === 'all'"
        class="cursor-pointer bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-[#008A20] font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ mediaStore.uploading ? 'Uploading…' : 'Upload video' }}

        <input
          type="file"
          accept="video/*"
          class="hidden"
          @change="onUpload('video', $event)"
        />
      </label>

      <button
        type="button"
        @click="showLibrary = !showLibrary"
        class="bg-white hover:bg-[#F4F6F5] border border-zinc-200 text-zinc-600 font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ showLibrary ? 'Hide library' : 'Pick from library' }}
      </button>
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

const onUpload = async (type, e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    const asset =
      type === 'image'
        ? await mediaStore.uploadImage(file, {
            title: file.name
          })
        : await mediaStore.uploadVideo(file, {
            title: file.name
          });

    const value = props.isUrlMode
      ? asset.filePath
      : asset.id;

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