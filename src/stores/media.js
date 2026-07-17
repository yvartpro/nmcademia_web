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
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      if (meta.title) formData.append('title', meta.title);
      if (meta.description) formData.append('description', meta.description);
      if (meta.thumbnailTitle) formData.append('thumbnailTitle', meta.thumbnailTitle);

      const res = await api.post('/admin/media/hls-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const totalBytes = file.size || 0;
          const pct = totalBytes > 0 ? Math.min(100, Math.round((progressEvent.loaded / totalBytes) * 100)) : 0;
          if (progressCallbacks.onOverall) progressCallbacks.onOverall(pct);
          if (progressCallbacks.onVideoProgress) progressCallbacks.onVideoProgress(pct);
          if (progressCallbacks.onImageProgress) {
            progressCallbacks.onImageProgress(thumbnailFile ? 100 : 0);
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
