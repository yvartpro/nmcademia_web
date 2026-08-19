<template>
  <div class="bg-surface-0 min-h-screen text-zinc-900 font-sans transition-colors duration-300">
    <router-view />

    <VideoPlayerModal />
    <VideoUploadPanel v-if="showUploadPanel" />
    <ChatWidget v-if="showChatWidget" />

    <!-- Global alert & confirmation modal -->
    <UiConfirmModal
      v-model="alertStore.visible"
      :title="alertStore.title"
      :message="alertStore.message"
      :variant="alertStore.variant"
      :confirm-label="alertStore.confirmLabel"
      :cancel-label="alertStore.cancelLabel"
      :show-cancel="!!alertStore.cancelLabel"
      @confirm="alertStore.confirm"
      @cancel="alertStore.cancel"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { useOwnerStore } from './stores/owner';
import { useAlertStore } from './stores/alert';
import { useLanguagesStore } from './stores/languages';
import { useTranslationsStore } from './stores/translations';
import ChatWidget from './components/ChatWidget.vue';
import VideoPlayerModal from '@/components/VideoPlayerModal.vue';
import VideoUploadPanel from '@/components/VideoUploadPanel.vue';
import UiConfirmModal from '@/components/ui/UiConfirmModal.vue';
import { useVideoSequencePreloader } from '@/composables/useVideoSequencePreloader';

const route = useRoute();
const themeStore = useThemeStore();
const ownerStore = useOwnerStore();
const alertStore = useAlertStore();
const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();
const preloader = useVideoSequencePreloader();

watch(
  () => languagesStore.selectedLanguageId,
  async (selectedId) => {
    if (!selectedId) return;
    try {
      await translationsStore.loadById(selectedId);
    } catch (err) {
      console.warn('Failed to sync translations for selected language:', err);
    }
  },
  { immediate: true }
);

onMounted(() => {
  themeStore.initTheme();
  ownerStore.fetchProfile();
  // Ensure available languages are loaded for the whole app
  languagesStore.fetchLanguages().then((langs) => {
    console.log('App mounted - languages loaded:', langs && langs.length ? langs.map(l => l.code) : langs);
  }).catch((err) => {
    console.error('Failed to load languages on app mount:', err);
  });
  
  // Start the background preloader
  preloader.init();
});

const showChatWidget = computed(() => {
  if (!route.path) return true;
  if (route.path.startsWith('/admin')) return false;
  if (route.path.startsWith('/app/learn/') && route.params.lessonId) return false;
  return true;
});

const showUploadPanel = computed(() => {
  return import.meta.env.DEV || route.query.videoUploader === '1';
});
</script>
