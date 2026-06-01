<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Media Library</h3>
        <p class="text-gray-500 text-xs mt-1">Upload images and videos, then attach them to founders, products, testimonials, and more.</p>
      </div>
      <div class="flex gap-2">
        <label class="cursor-pointer bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">
          + Upload image
          <input type="file" accept="image/*" class="hidden" @change="uploadFile('image', $event)" />
        </label>
        <label class="cursor-pointer bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-200 font-bold py-2 px-4 rounded-lg text-xs transition">
          + Upload video
          <input type="file" accept="video/*" class="hidden" @change="uploadFile('video', $event)" />
        </label>
      </div>
    </div>

    <div v-if="mediaStore.loading" class="text-gray-500 text-xs">Loading media…</div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="asset in mediaStore.assets"
        :key="asset.id"
        class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-lg group"
      >
        <div class="aspect-square bg-slate-900 relative">
          <img
            v-if="asset.type === 'image'"
            :src="mediaStore.resolveUrl(asset)"
            :alt="asset.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-3xl bg-black">🎬</div>
          <span class="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/70 text-gray-300">
            {{ asset.type }}
          </span>
        </div>
        <div class="p-3 space-y-2">
          <p class="text-white text-xs font-bold truncate" :title="asset.title">{{ asset.title || 'Untitled' }}</p>
          <p class="text-amber-500 font-mono text-[10px]">ID: {{ asset.id }}</p>
          <button
            @click="copyId(asset.id)"
            class="w-full text-[10px] text-gray-400 hover:text-amber-400 border border-gray-800 rounded py-1 transition"
          >
            Copy ID
          </button>
          <button
            @click="handleDelete(asset.id)"
            class="w-full text-[10px] text-red-400 hover:text-red-300 border border-red-900/30 rounded py-1 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-if="!mediaStore.loading && mediaStore.assets.length === 0" class="text-center text-gray-500 text-sm py-12">
      No media uploaded yet.
    </p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMediaStore } from '../../stores/media';

const mediaStore = useMediaStore();

onMounted(() => mediaStore.fetchAll());

const uploadFile = async (type, e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    if (type === 'image') await mediaStore.uploadImage(file, { title: file.name });
    else await mediaStore.uploadVideo(file, { title: file.name });
  } catch {
    alert('Upload failed.');
  }
  e.target.value = '';
};

const copyId = (id) => {
  navigator.clipboard.writeText(String(id));
  alert(`Copied media ID: ${id}`);
};

const handleDelete = async (id) => {
  if (confirm('Delete this media file? Content using it may show broken images.')) {
    await mediaStore.deleteAsset(id);
  }
};
</script>
