<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-gray-400 uppercase tracking-wider font-bold text-[10px]">{{ label }}</label>

    <div v-if="selectedAsset" class="flex items-center gap-3 p-2 bg-slate-900 border border-gray-800 rounded-lg">
      <img
        v-if="selectedAsset.type === 'image'"
        :src="mediaStore.resolveUrl(selectedAsset)"
        :alt="selectedAsset.title"
        class="w-14 h-14 object-cover rounded border border-gray-800"
      />
      <div v-else class="w-14 h-14 rounded bg-gray-800 flex items-center justify-center text-lg">🎬</div>
      <div class="flex-grow min-w-0">
        <p class="text-white font-medium truncate text-xs">{{ selectedAsset.title || `Asset #${selectedAsset.id}` }}</p>
        <p class="text-gray-500 text-[10px] truncate" :title="mediaStore.getCopyUrl(selectedAsset)">{{ mediaStore.getCopyUrl(selectedAsset) }}</p>
      </div>
      <button type="button" @click="clear" class="text-red-400 hover:text-red-300 text-xs font-bold shrink-0">Clear</button>
    </div>

    <div class="flex flex-wrap gap-2">
      <label class="cursor-pointer bg-slate-900 hover:bg-slate-800 border border-gray-800 text-amber-400 font-bold px-3 py-1.5 rounded text-[10px] transition">
        {{ mediaStore.uploading ? 'Uploading…' : 'Upload image' }}
        <input type="file" accept="image/*" class="hidden" @change="onUpload" />
      </label>
      <button
        type="button"
        @click="showLibrary = !showLibrary"
        class="bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300 font-bold px-3 py-1.5 rounded text-[10px] transition"
      >
        {{ showLibrary ? 'Hide library' : 'Pick from library' }}
      </button>
    </div>

    <div
      v-if="showLibrary"
      class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-900/50 border border-gray-800 rounded-lg custom-scrollbar"
    >
      <button
        v-for="asset in imageAssets"
        :key="asset.id"
        type="button"
        @click="select(asset)"
        :class="[
          'aspect-square rounded border overflow-hidden transition',
          modelValue === asset.id ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-800 hover:border-gray-600'
        ]"
      >
        <img :src="mediaStore.resolveUrl(asset)" :alt="asset.title" class="w-full h-full object-cover" />
      </button>
      <p v-if="imageAssets.length === 0" class="col-span-full text-center text-gray-500 text-[10px] py-4">
        No images yet. Upload one above or open the Media Library tab.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMediaStore } from '../../stores/media';

const props = defineProps({
  modelValue: { type: [Number, String, null], default: null },
  label: { type: String, default: 'Photo / image' }
});

const emit = defineEmits(['update:modelValue']);

const mediaStore = useMediaStore();
const showLibrary = ref(false);

const imageAssets = computed(() => mediaStore.assets.filter(a => a.type === 'image'));

const selectedAsset = computed(() => {
  if (!props.modelValue) return null;
  return mediaStore.getById(Number(props.modelValue));
});

onMounted(() => {
  if (mediaStore.assets.length === 0) {
    mediaStore.fetchAll();
  }
});

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue && !selectedAsset.value && mediaStore.assets.length === 0) {
      mediaStore.fetchAll();
    }
  }
);

const select = (asset) => {
  emit('update:modelValue', asset.id);
  showLibrary.value = false;
};

const clear = () => {
  emit('update:modelValue', null);
};

const onUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const asset = await mediaStore.uploadImage(file, { title: file.name });
    emit('update:modelValue', asset.id);
  } catch (err) {
    alert('Upload failed. Try again.');
  }
  e.target.value = '';
};
</script>
