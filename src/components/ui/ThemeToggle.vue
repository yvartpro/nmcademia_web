<template>
  <button
    type="button"
    @click="themeStore.toggleTheme()"
    class="p-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors nma-touch"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle theme"
  >
    <Sun v-if="themeStore.isDark" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '../../stores/theme';

const themeStore = useThemeStore();
</script>
