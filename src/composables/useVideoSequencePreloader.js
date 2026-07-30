import { watch, ref } from 'vue';
import { useVideoPlayerStore } from '../stores/videoPlayer';
import { useSettingsStore } from '../stores/settings';
import { useMemberStore } from '../stores/member';
import { useCatalogStore } from '../stores/catalog';
import { useContentStore } from '../stores/content';
import { preloadHlsVideo } from '../utils/hlsPreloader';
import api, { getFullMediaUrl } from '../api';

let initialized = false;

export function useVideoSequencePreloader() {
  const videoStore = useVideoPlayerStore();
  const settingsStore = useSettingsStore();
  const memberStore = useMemberStore();
  const catalogStore = useCatalogStore();
  const contentStore = useContentStore();

  const preloadedUrls = new Set();
  let presentationCache = null;

  const doPreload = (urlOrAsset) => {
    if (!urlOrAsset) return;
    const url = getFullMediaUrl(urlOrAsset);
    if (!url) return;
    
    // Only preload .m3u8 if it's an HLS stream (or try anyway)
    if (url.includes('.m3u8')) {
      if (!preloadedUrls.has(url)) {
        preloadedUrls.add(url);
        preloadHlsVideo(url);
      }
    }
  };

  const getSettingsUrl = (key) => {
    return settingsStore.settings?.[key];
  };

  const init = async () => {
    if (initialized) return;
    initialized = true;

    // Load necessary stores if not loaded
    if (!settingsStore.settings || Object.keys(settingsStore.settings).length === 0) {
      await settingsStore.fetchSettings();
    }

    // Step 1: Preload initial video on home page load
    const nmVideo = getSettingsUrl('nm_video_url');
    const riskVideo = getSettingsUrl('risk_video');
    
    if (memberStore.isRegistered && nmVideo) {
      doPreload(nmVideo);
    } else if (!memberStore.isRegistered && riskVideo) {
      doPreload(riskVideo);
    } else if (nmVideo) {
      doPreload(nmVideo);
    }

    // Watch video player to preload the NEXT video in the sequence
    watch(() => videoStore.src, async (currentSrc) => {
      if (!currentSrc) return;

      const nmVideoUrl = getSettingsUrl('nm_video_url') ? getFullMediaUrl(getSettingsUrl('nm_video_url')) : null;
      const riskVideoUrl = getSettingsUrl('risk_video') ? getFullMediaUrl(getSettingsUrl('risk_video')) : null;
      const productVideoUrl = getSettingsUrl('product_video') ? getFullMediaUrl(getSettingsUrl('product_video')) : null;
      const binaryVideoUrl = getSettingsUrl('binary_tree_video') ? getFullMediaUrl(getSettingsUrl('binary_tree_video')) : null;

      // 1 -> 2: If playing first video, preload product video
      if (currentSrc === nmVideoUrl || currentSrc === riskVideoUrl) {
        if (productVideoUrl) doPreload(productVideoUrl);
      }
      
      // 2 -> 3: If playing product video, preload binary tree
      else if (currentSrc === productVideoUrl) {
        if (binaryVideoUrl) doPreload(binaryVideoUrl);
      }

      // 3 -> 4: If playing binary tree, preload business plan for the user's country
      else if (currentSrc === binaryVideoUrl) {
        const countryCode = catalogStore.selectedCountry?.code || localStorage.getItem('selected_country') || 'NG';
        try {
          if (!presentationCache || presentationCache.countryCode !== countryCode) {
            const response = await api.get(`/presentations/${countryCode}`);
            presentationCache = { countryCode, data: response.data };
          }
          if (presentationCache.data?.mediaUrl) {
            doPreload(presentationCache.data.mediaUrl);
          }
        } catch (err) {
          console.warn('Failed to fetch presentation for preloading:', err);
        }
      }

      // 4 -> 5: If playing business plan, preload first testimonial
      else if (presentationCache?.data?.mediaUrl && currentSrc === getFullMediaUrl(presentationCache.data.mediaUrl)) {
        if (contentStore.testimonials.length === 0) {
          await contentStore.fetchAll();
        }
        
        const videoTestimonials = contentStore.testimonials.filter(t => t.videoUrl || t.videoAsset);
        if (videoTestimonials.length > 0) {
          const firstT = videoTestimonials[0];
          doPreload(firstT.videoUrl || firstT.videoAsset);
        }
      }

      // 5 -> next: If playing a testimonial, preload the next testimonial
      else {
        const videoTestimonials = contentStore.testimonials.filter(t => t.videoUrl || t.videoAsset);
        const currentIndex = videoTestimonials.findIndex(t => {
          const tUrl = getFullMediaUrl(t.videoUrl || t.videoAsset);
          return tUrl === currentSrc;
        });

        if (currentIndex !== -1 && currentIndex + 1 < videoTestimonials.length) {
          const nextT = videoTestimonials[currentIndex + 1];
          doPreload(nextT.videoUrl || nextT.videoAsset);
        }
      }
    });
  };

  return { init };
}
