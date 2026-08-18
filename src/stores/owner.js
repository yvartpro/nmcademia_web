import { defineStore } from 'pinia';
import api, { getFullMediaUrl } from '../api';
import { useLanguagesStore } from './languages';

const getLanguageParams = () => {
  const languagesStore = useLanguagesStore();
  const selectedId = Number(localStorage.getItem('nma.selectedLanguageId') ?? languagesStore.selectedLanguageId ?? 0);
  const language = languagesStore.languages.find((item) => item.id === selectedId)
    || languagesStore.languages.find((item) => item.isDefault)
    || languagesStore.languages[0];

  return language && language.code ? { params: { lang: language.code } } : {};
};

export const useOwnerStore = defineStore('owner', {
  state: () => ({
    name: 'Network Marketing Professional',
    bio: 'Welcome to the platform.',
    intro: null,
    whatsappNumber: '',
    whatsappGroupLink: '',
    domainName: '',
    photoUrl: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProfile() {
      this.loading = true;
      try {
        const response = await api.get('/owner/profile', getLanguageParams());
        if (response.data) {
          const link = response.data.whatsappGroupLink ?? response.data.whatsapp_group_link ?? this.whatsappGroupLink;
          this.name = response.data.name || this.name;
          this.bio = response.data.bio || this.bio;
          this.intro = response.data.intro || this.intro;
          this.whatsappNumber = response.data.whatsappNumber || this.whatsappNumber;
          this.whatsappGroupLink = link || this.whatsappGroupLink;
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
