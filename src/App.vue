<template>
  <div class="bg-[#0b0f19] min-h-screen text-white font-sans selection:bg-amber-400 selection:text-slate-900">
    <router-view />
    
    <!-- Float chat widget only on non-admin routes -->
    <ChatWidget v-if="showChatWidget" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ChatWidget from './components/ChatWidget.vue';

const route = useRoute();

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
  background-color: #0b0f19;
}
</style>
