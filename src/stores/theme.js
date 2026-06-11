import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  const initTheme = () => {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  return { isDark, toggleTheme, initTheme };
});
