import { defineStore } from 'pinia';
import api, { getFullMediaUrl } from '../api';

export const useOwnerStore = defineStore('owner', {
  state: () => ({
    name: 'Network Marketing Professional',
    bio: 'Welcome to the platform.',
    whatsappNumber: '',
    domainName: '',
    photoUrl: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProfile() {
      this.loading = true;
      try {
        const response = await api.get('/owner/profile');
        if (response.data) {
          this.name = response.data.name || this.name;
          this.bio = response.data.bio || this.bio;
          this.whatsappNumber = response.data.whatsappNumber || this.whatsappNumber;
          this.domainName = response.data.domainName || this.domainName;
          
          if (response.data.photo) {
            this.photoUrl = getFullMediaUrl(response.data.photo.filePath);
          }
        }
      } catch (err) {
        console.error('Failed to load owner profile:', err);
        this.error = 'Failed to load profile details.';
      } finally {
        this.loading = false;
      }
    }
  }
});
