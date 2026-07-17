import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';

export const useVideoUploadStore = defineStore('videoUpload', () => {
  const uploading = ref(false);
  const processing = ref(false); // NEW: true while server is transcoding in background
  const progress = ref(0);
  const elapsedSeconds = ref(0);
  const error = ref('');
  const statusMessage = ref('');
  const lastAsset = ref(null);

  const reset = () => {
    uploading.value = false;
    processing.value = false;
    progress.value = 0;
    elapsedSeconds.value = 0;
    error.value = '';
    statusMessage.value = '';
  };

  /**
   * Poll /admin/media/:id/status every 5 seconds until
   * processingStatus is 'ready' or 'error'.
   */
  const pollStatus = (assetId) => {
    return new Promise((resolve, reject) => {
      const interval = window.setInterval(async () => {
        try {
          const { data } = await api.get(`/admin/media/${assetId}/status`);
          if (data.processingStatus === 'ready') {
            window.clearInterval(interval);
            processing.value = false;
            statusMessage.value = 'Video processed successfully! ✓';
            lastAsset.value = data;
            resolve(data);
          } else if (data.processingStatus === 'error') {
            window.clearInterval(interval);
            processing.value = false;
            error.value = data.processingError || 'Transcoding failed on the server.';
            statusMessage.value = 'Processing failed';
            reject(new Error(error.value));
          } else {
            // still 'pending' or 'processing'
            statusMessage.value = `Processing video on server... (${data.processingStatus})`;
          }
        } catch (err) {
          // Network hiccup — keep polling, don't abort
          console.warn('[VideoUpload] Polling error, will retry:', err.message);
        }
      }, 5000); // poll every 5 seconds
    });
  };

  const uploadVideo = async ({ file, thumbnail = null, title = '', description = '', excerpt = '' }) => {
    if (!file) throw new Error('No file selected');

    reset();
    uploading.value = true;
    statusMessage.value = 'Uploading video...';
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
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const response = await api.post('/admin/media/hls-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!event.total) return;
          progress.value = Math.round((event.loaded / event.total) * 100);
          if (progress.value >= 100) {
            statusMessage.value = 'Upload complete! Waiting for server to start processing...';
          }
        }
      });

      // Server responded with 202 Accepted immediately (no more 504!)
      const pendingAsset = response.data;
      lastAsset.value = pendingAsset;

      // Switch from "uploading" to "processing" mode
      uploading.value = false;
      window.clearInterval(timer);
      processing.value = true;
      statusMessage.value = 'Video received! Processing in background...';

      // Poll the server every 5 seconds until transcoding is complete
      const finalAsset = await pollStatus(pendingAsset.id);
      return finalAsset;

    } catch (err) {
      error.value = err?.response?.data?.error || err?.message || 'Upload failed';
      statusMessage.value = 'Upload failed';
      throw err;
    } finally {
      window.clearInterval(timer);
      uploading.value = false;
      // Note: processing.value is set to false inside pollStatus when done
    }
  };

  const formatElapsed = () => {
    const mins = Math.floor(elapsedSeconds.value / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds.value % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return {
    uploading,
    processing,
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
