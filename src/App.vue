<template>
  <div class="bg-surface-0 min-h-screen text-zinc-900 font-sans transition-colors duration-300">
    <router-view />

    <VideoPlayerModal />
    <ChatWidget v-if="showChatWidget" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { useOwnerStore } from './stores/owner';
import ChatWidget from './components/ChatWidget.vue';
import VideoPlayerModal from '@/components/VideoPlayerModal.vue';

const route = useRoute();
const themeStore = useThemeStore();
const ownerStore = useOwnerStore();

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
