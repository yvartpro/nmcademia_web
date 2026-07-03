<template>
  <div class="bg-surface-0 min-h-screen text-zinc-900 font-sans transition-colors duration-300">
    <router-view />

    <VideoPlayerModal />
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { useOwnerStore } from './stores/owner';
import { useAlertStore } from './stores/alert';
import ChatWidget from './components/ChatWidget.vue';
import VideoPlayerModal from '@/components/VideoPlayerModal.vue';
import UiConfirmModal from '@/components/ui/UiConfirmModal.vue';

const route = useRoute();
const themeStore = useThemeStore();
const ownerStore = useOwnerStore();
const alertStore = useAlertStore();

onMounted(() => {
  themeStore.initTheme();
  ownerStore.fetchProfile();
});

const showChatWidget = computed(() => {
  if (!route.path) return true;
  if (route.path.startsWith('/admin')) return false;
  if (route.path.startsWith('/app/learn/') && route.params.lessonId) return false;
  return true;
});
</script>
