<template>
  <div class="bg-gray-50 dark:bg-[#121212] min-h-screen text-slate-900 dark:text-gray-100 font-sans selection:bg-amber-400 selection:text-slate-900 transition-colors duration-300">
    <router-view />
    
    <!-- Float chat widget only on non-admin routes -->
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
  // Hide support chat widget inside the administration panel
  return route.path && !route.path.startsWith('/admin');
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;755;800&family=Outfit:wght@400;600;700;800;900&display=swap');

html, body {
  margin: 0;
  padding: 0;
  @apply bg-gray-50 dark:bg-[#121212];
}
</style>
