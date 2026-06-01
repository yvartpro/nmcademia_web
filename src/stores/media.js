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

  const deleteAsset = async (id) => {
    await api.delete(`/admin/media/${id}`);
    assets.value = assets.value.filter(a => a.id !== id);
  };

  const resolveUrl = (assetOrPath) => getFullMediaUrl(assetOrPath);

  const getCopyUrl = (asset) => {
    if (!asset) return '';
    const url = asset.publicUrl || asset.filePath;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
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
    deleteAsset,
    resolveUrl,
    getCopyUrl,
    getById
  };
});
