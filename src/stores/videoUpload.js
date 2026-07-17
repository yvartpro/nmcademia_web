import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';

export const useVideoUploadStore = defineStore('videoUpload', () => {
  const uploading = ref(false);
  const progress = ref(0);
  const elapsedSeconds = ref(0);
  const error = ref('');
  const statusMessage = ref('');
  const lastAsset = ref(null);

  const reset = () => {
    uploading.value = false;
    progress.value = 0;
    elapsedSeconds.value = 0;
    error.value = '';
    statusMessage.value = '';
  };

  const uploadVideo = async ({ file, title = '', description = '', excerpt = '' }) => {
    if (!file) throw new Error('No file selected');

    reset();
    uploading.value = true;
    statusMessage.value = 'Preparing upload...';
    error.value = '';

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      elapsedSeconds.value = Math.floor((Date.now() - startedAt) / 1000);
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name || 'Uploaded video');
      formData.append('description', description || '');
      formData.append('excerpt', excerpt || '');

      const response = await api.post('/admin/media/hls-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!event.total) return;
          progress.value = Math.round((event.loaded / event.total) * 100);
        }
      });

      lastAsset.value = response.data;
      statusMessage.value = 'Upload finished successfully';
      return response.data;
    } catch (err) {
      error.value = err?.response?.data?.error || err?.message || 'Upload failed';
      statusMessage.value = 'Upload failed';
      throw err;
    } finally {
      window.clearInterval(timer);
      uploading.value = false;
    }
  };

  const formatElapsed = () => {
    const mins = Math.floor(elapsedSeconds.value / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds.value % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return {
    uploading,
    progress,
    elapsedSeconds,
    error,
    statusMessage,
    lastAsset,
    reset,
    uploadVideo,
    formatElapsed
  };
});
