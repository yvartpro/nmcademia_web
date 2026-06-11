<template>
  <div class="bg-surface-0 min-h-screen text-zinc-900 font-sans transition-colors duration-300">
    <router-view />

    <ChatWidget v-if="showChatWidget" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from './stores/theme';
import ChatWidget from './components/ChatWidget.vue';

const route = useRoute();
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});

const showChatWidget = computed(() => {
  if (!route.path) return true;
  if (route.path.startsWith('/admin')) return false;
  if (route.path.startsWith('/app/learn/') && route.params.lessonId) return false;
  return true;
});
</script>
