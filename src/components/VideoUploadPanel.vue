<template>
  <div class="fixed bottom-4 right-4 z-[220] w-[92vw] max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-950/95 p-4 text-white shadow-2xl backdrop-blur">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold">HLS video uploader</p>
        <p class="text-xs text-zinc-400">Uploads 360p + 720p variants and tracks upload time.</p>
      </div>
      <button class="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300" @click="closePanel">
        Hide
      </button>
    </div>

    <div class="mt-4 space-y-3">
      <label class="block text-sm">
        <span class="mb-1 block text-zinc-400">Video file</span>
        <input ref="fileInput" type="file" accept="video/*" class="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-full file:border-0 file:bg-accent/20 file:px-3 file:py-1.5 file:text-accent" @change="onFileSelected" />
      </label>

      <label class="block text-sm">
        <span class="mb-1 block text-zinc-400">Title</span>
        <input v-model="title" class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-accent" placeholder="Course lesson title" />
      </label>

      <label class="block text-sm">
        <span class="mb-1 block text-zinc-400">Description</span>
        <textarea v-model="description" rows="3" class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-accent" placeholder="Describe the content for your audience" />
      </label>

      <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm">
        <span class="text-zinc-400">Upload progress</span>
        <span class="font-semibold text-accent">{{ uploadStore.progress }}%</span>
      </div>

      <div v-if="uploadStore.uploading" class="rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
        <div class="mb-2 flex items-center justify-between">
          <span>Uploading with adaptive HLS encoding</span>
          <span>{{ uploadStore.formatElapsed() }}</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div class="h-full rounded-full bg-accent transition-all duration-300" :style="{ width: uploadStore.progress + '%' }" />
        </div>
      </div>

      <div v-if="uploadStore.error" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
        {{ uploadStore.error }}
      </div>

      <div v-if="uploadStore.lastAsset" class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
        <p class="font-semibold">Ready to play</p>
        <p class="mt-1 text-xs text-emerald-200">{{ uploadStore.lastAsset.title }}</p>
        <button class="mt-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200" @click="openLastAsset">
          Open in player
        </button>
      </div>

      <button class="w-full rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:opacity-90" :disabled="uploadStore.uploading || !selectedFile" @click="submitUpload">
        {{ uploadStore.uploading ? 'Uploading...' : 'Upload video' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useVideoUploadStore } from '@/stores/videoUpload';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const uploadStore = useVideoUploadStore();
const videoStore = useVideoPlayerStore();
const fileInput = ref(null);
const selectedFile = ref(null);
const title = ref('');
const description = ref('');

const closePanel = () => {
  uploadStore.reset();
  selectedFile.value = null;
  title.value = '';
  description.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files?.[0] || null;
};

const submitUpload = async () => {
  if (!selectedFile.value) return;

  await uploadStore.uploadVideo({
    file: selectedFile.value,
    title: title.value,
    description: description.value
  });
};

const openLastAsset = () => {
  if (!uploadStore.lastAsset) return;
  videoStore.open({
    src: uploadStore.lastAsset.filePath,
    title: uploadStore.lastAsset.title,
    thumbnail: uploadStore.lastAsset.thumbnailPath || null,
    asset: uploadStore.lastAsset
  });
};
</script>
