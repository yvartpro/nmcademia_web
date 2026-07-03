import { defineStore } from 'pinia';
import { ref } from 'vue';
import api, { getFullMediaUrl } from '../api';

export const useMediaStore = defineStore('media', () => {
  const assets = ref([]);
  const loading = ref(false);
  const uploading = ref(false);

  const fetchAll = async () => {
    loading.value = true;
    try {
      const res = await api.get('/admin/media');
      assets.value = res.data;
    } catch (err) {
      console.error('fetchAll media failed:', err);
    } finally {
      loading.value = false;
    }
  };

  const uploadImage = async (file, meta = {}) => {
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (meta.title) formData.append('title', meta.title);
      if (meta.description) formData.append('description', meta.description);
      const res = await api.post('/admin/media/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      assets.value.unshift(res.data);
      return res.data;
    } finally {
      uploading.value = false;
    }
  };

  const uploadVideo = async (file, meta = {}) => {
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (meta.title) formData.append('title', meta.title);
      const res = await api.post('/admin/media/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      assets.value.unshift(res.data);
      return res.data;
    } finally {
      uploading.value = false;
    }
  };

  const uploadVideoWithThumbnail = async (file, thumbnailFile = null, meta = {}, progressCallbacks = {}) => {
    // progressCallbacks: { onVideoProgress: (pct), onImageProgress: (pct), onOverall: (pct) }
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      if (meta.title) formData.append('title', meta.title);
      if (meta.description) formData.append('description', meta.description);
      if (meta.thumbnailTitle) formData.append('thumbnailTitle', meta.thumbnailTitle);
      if (meta.thumbnailDescription) formData.append('thumbnailDescription', meta.thumbnailDescription);

      const totalBytes = file.size + (thumbnailFile ? thumbnailFile.size : 0);

      const res = await api.post('/admin/media/video-with-thumbnail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded;
          const imgSize = thumbnailFile ? thumbnailFile.size : 0;
          const vidSize = file.size;

          // overall
          const overallPct = totalBytes > 0 ? Math.min(100, Math.round((loaded / totalBytes) * 100)) : 0;
          if (progressCallbacks.onOverall) progressCallbacks.onOverall(overallPct);

          // map loaded to per-file progress
          if (thumbnailFile) {
            if (loaded <= imgSize) {
              const imgPct = Math.min(100, Math.round((loaded / imgSize) * 100));
              if (progressCallbacks.onImageProgress) progressCallbacks.onImageProgress(imgPct);
              if (progressCallbacks.onVideoProgress) progressCallbacks.onVideoProgress(0);
            } else {
              if (progressCallbacks.onImageProgress) progressCallbacks.onImageProgress(100);
              const vidLoaded = loaded - imgSize;
              const vidPct = vidSize > 0 ? Math.min(100, Math.round((vidLoaded / vidSize) * 100)) : 0;
              if (progressCallbacks.onVideoProgress) progressCallbacks.onVideoProgress(vidPct);
            }
          } else {
            // Only video
            const vidPct = vidSize > 0 ? Math.min(100, Math.round((loaded / vidSize) * 100)) : 0;
            if (progressCallbacks.onVideoProgress) progressCallbacks.onVideoProgress(vidPct);
          }
        }
      });
      assets.value.unshift(res.data);
      return res.data;
    } finally {
      uploading.value = false;
    }
  };

  const deleteAsset = async (id) => {
    await api.delete(`/admin/media/${id}`);
    assets.value = assets.value.filter(a => a.id !== id);
  };

  const updateThumbnail = async (id, imageFile) => {
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('thumbnail', imageFile);
      const res = await api.patch(`/admin/media/${id}/thumbnail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const idx = assets.value.findIndex(a => a.id === id);
      if (idx !== -1) assets.value[idx] = res.data;
      return res.data;
    } finally {
      uploading.value = false;
    }
  };

  const resolveUrl = (assetOrPath) => getFullMediaUrl(assetOrPath);

  const getCopyUrl = (asset) => {
    if (!asset) return '';
    const url = asset.publicUrl || asset.filePath;
    return getFullMediaUrl(url);
  };

  const getById = (id) => assets.value.find(a => a.id === id);

  return {
    assets,
    loading,
    uploading,
    fetchAll,
    uploadImage,
    uploadVideo,
    uploadVideoWithThumbnail,
    updateThumbnail,
    deleteAsset,
    resolveUrl,
    getCopyUrl,
    getById
  };
});
