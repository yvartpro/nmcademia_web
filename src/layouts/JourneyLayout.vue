<template>
  <div v-if="journey" class="min-h-screen bg-surface-0 dark:bg-surface-0-dark pb-20 lg:pb-6">
    <!-- Desktop sidebar (only when nav items exist) -->
    <aside
      v-if="navItems.length"
      class="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 flex-col border-r border-zinc-200/80 dark:border-white/[0.06] bg-surface-1 dark:bg-surface-1-dark z-40"
    >
      <div class="p-4 border-b border-zinc-200/80 dark:border-white/[0.06]">
        <router-link :to="journey.defaultRoute">
          <AppLogo :logo-url="logoUrl" size="sm" />
        </router-link>
        <p class="text-[10px] text-zinc-500 mt-2 uppercase tracking-wider">{{ journey.title }}</p>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-accent/15 text-accent-dark dark:text-accent-light'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-zinc-200/80 dark:border-white/[0.06] text-xs text-zinc-500">
        {{ memberStore.displayName }}
      </div>
    </aside>

    <div :class="navItems.length ? 'lg:pl-56' : ''">
      <header
        class="sticky top-0 z-30 border-b border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/90 dark:bg-surface-1-dark/90 backdrop-blur-xl px-4 py-3"
      >
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <router-link :to="journey.defaultRoute">
            <AppLogo :logo-url="logoUrl" size="sm" :show-text="navItems.length === 0" />
          </router-link>
          <div class="flex items-center gap-2">
            <span
              v-if="journey.features.gamification && memberStore.streak"
              class="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-streak/10 text-streak text-xs font-bold"
            >
              <Flame :size="14" />
              {{ memberStore.streak }}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 py-6">
        <slot />
      </main>
    </div>

  <!-- Mobile bottom nav -->
    <nav
      v-if="navItems.length"
      class="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/95 dark:bg-surface-1-dark/95 backdrop-blur-xl nma-safe-bottom"
    >
      <div class="flex justify-around px-2 pt-2 pb-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-0.5 px-3 py-2 min-w-[56px]"
          :class="isActive(item.to) ? 'text-accent-dark dark:text-accent-light' : 'text-zinc-500'"
        >
          <component :is="item.icon" :size="22" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BookOpen, BarChart3, User, Flame, Presentation } from 'lucide-vue-next';
import AppLogo from '../components/ui/AppLogo.vue';
import ThemeToggle from '../components/ui/ThemeToggle.vue';
import { useMemberStore } from '../stores/member';
import { useSettingsStore } from '../stores/settings';
import { getFullMediaUrl } from '../api';

const route = useRoute();
const memberStore = useMemberStore();
const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.fetchSettings();
  if (memberStore.profile.registered) memberStore.checkDailyStreak();
});

const journey = computed(() => memberStore.journey);
const logoUrl = computed(() => {
  const url = settingsStore.settings?.logo_url;
  return url ? getFullMediaUrl(url) : '';
});

const navItems = computed(() => {
  const j = journey.value;
  if (!j) return [];
  const items = [];
  if (j.features.courses) {
    items.push({ to: '/app/training', label: 'Training', icon: BookOpen });
  }
  if (j.features.progress) {
    items.push({ to: '/app/progress', label: 'Progress', icon: BarChart3 });
  }
  if (j.features.presentation) {
    items.push({ to: '/presentation', label: 'Presentation', icon: Presentation });
  }
  items.push({ to: '/app/settings', label: 'You', icon: User });
  return items;
});

const isActive = (path) => route.path === path || route.path.startsWith(path + '/');
</script>
