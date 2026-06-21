import { defineStore } from 'pinia';
import { getFullMediaUrl } from '../api';


export const useVideoPlayerStore = defineStore('videoPlayer', {
  state: () => ({
    visible: false,
    src: null,
    title: '',
  }),

  actions: {
    resolveUrl(assetOrPath) {
      return getFullMediaUrl(assetOrPath);
    },

    open({ src, title = '' }) {
      this.src = src;
      this.title = title;
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.src = null;
      this.title = '';
    },
  },
});