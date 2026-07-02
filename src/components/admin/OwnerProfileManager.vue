<template>
  <div class="space-y-6 motion-safe:animate-fade-in">
    <div class="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-bold text-zinc-900 mb-4">Personal Profile & Domain Mapping</h2>
      
      <div v-if="loading" class="text-sm text-zinc-500">Loading profile...</div>
      
      <form v-else @submit.prevent="saveProfile" class="space-y-6">
        <!-- Photo Upload -->
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-2">Profile Photo</label>
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden bg-zinc-50">
              <img v-if="form.photoUrl" :src="form.photoUrl" class="w-full h-full object-cover" />
              <span v-else class="text-2xl text-zinc-400">👤</span>
            </div>
            <div class="space-y-2">
              <UiButton type="button" variant="outline" @click="openMediaLibrary">Choose from Library</UiButton>
              <p class="text-xs text-zinc-500">Recommended size: 500x500px</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-zinc-700 mb-1">Full Name</label>
            <input v-model="form.name" type="text" class="nma-input" required placeholder="e.g. Dieudonné Greatman BIGIRIMANA" />
          </div>

          <!-- WhatsApp Number -->
          <div>
            <label class="block text-sm font-semibold text-zinc-700 mb-1">WhatsApp Number</label>
            <input v-model="form.whatsappNumber" type="text" class="nma-input" placeholder="e.g. +2348030001111" />
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-1">Professional Bio</label>
          <textarea v-model="form.bio" rows="4" class="nma-input" required placeholder="Tell visitors about your journey..."></textarea>
        </div>

        <!-- Domain Name -->
        <div class="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <label class="block text-sm font-semibold text-zinc-900 mb-1">Mapped Domain Name</label>
          <p class="text-xs text-zinc-600 mb-3">When a visitor accesses this domain, they will see your profile and leads will be routed to your account.</p>
          <input v-model="form.domainName" type="text" class="nma-input bg-white" placeholder="e.g. my-network-site.com" />
        </div>

        <div class="flex justify-end pt-4 border-t border-zinc-100">
          <UiButton type="submit" variant="primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Profile' }}
          </UiButton>
        </div>
      </form>
    </div>

    <!-- Media Library Modal -->
    <div v-if="showMediaLibrary" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div class="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h3 class="font-bold text-zinc-900">Select Profile Photo</h3>
          <button @click="showMediaLibrary = false" class="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg transition">✕</button>
        </div>
        <div class="flex-grow overflow-auto p-4">
          <MediaLibrary v-model="form.photoId" @select="selectMedia" :selectable="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { getFullMediaUrl } from '@/api';
import UiButton from '../ui/UiButton.vue';
import MediaLibrary from './MediaLibrary.vue';

const loading = ref(true);
const saving = ref(false);
const showMediaLibrary = ref(false);

const form = ref({
  name: '',
  bio: '',
  whatsappNumber: '',
  domainName: '',
  photoId: null,
  photoUrl: null
});

onMounted(async () => {
  try {
    const res = await api.get('/admin/owner/profile');
    if (res.data) {
      form.value = {
        name: res.data.name || '',
        bio: res.data.bio || '',
        whatsappNumber: res.data.whatsappNumber || '',
        domainName: res.data.domainName || '',
        photoId: res.data.photoId || null,
        photoUrl: res.data.photo ? getFullMediaUrl(res.data.photo.filePath) : null
      };
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    alert('Could not load profile data.');
  } finally {
    loading.value = false;
  }
});

const openMediaLibrary = () => {
  showMediaLibrary.value = true;
};

const selectMedia = (media) => {
  form.value.photoId = media.id;
  form.value.photoUrl = getFullMediaUrl(media.filePath);
  showMediaLibrary.value = false;
  console.log('Selected media:', media);
};

const saveProfile = async () => {
  saving.value = true;
  try {
    const res = await api.put('/admin/owner/profile', {
      name: form.value.name,
      bio: form.value.bio,
      whatsappNumber: form.value.whatsappNumber,
      domainName: form.value.domainName,
      photoId: form.value.photoId
    });
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(error.response?.data?.message || 'Failed to update profile.');
  } finally {
    saving.value = false;
  }
};
</script>
