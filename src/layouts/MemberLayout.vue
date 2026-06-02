<template>
  <div class="min-h-screen bg-surface-0 dark:bg-surface-0-dark pb-20 sm:pb-6">
    <!-- Desktop sidebar -->
    <aside class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-zinc-200/80 dark:border-white/[0.06] bg-surface-1 dark:bg-surface-1-dark z-40">
      <div class="p-5 border-b border-zinc-200/80 dark:border-white/[0.06]">
        <router-link to="/app/home">
          <AppLogo :logo-url="logoUrl" size="sm" />
        </router-link>
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
      <div class="p-4 border-t border-zinc-200/80 dark:border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full nma-gradient-gold flex items-center justify-center text-xs font-bold text-zinc-900">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ memberStore.displayName }}</p>
            <p class="text-xs text-zinc-500">Level {{ memberStore.level }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 lg:hidden border-b border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/90 dark:bg-surface-1-dark/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <AppLogo :logo-url="logoUrl" size="sm" :show-text="false" />
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2 py-1 rounded-full bg-streak/10 text-streak text-xs font-bold">
            <Flame :size="14" />
            {{ memberStore.streak }}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main class="max-w-5xl mx-auto px-4 py-6">
        <slot />
      </main>
    </div>

    <!-- Mobile bottom nav -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 dark:border-white/[0.06] bg-surface-1/95 dark:bg-surface-1-dark/95 backdrop-blur-xl nma-safe-bottom">
      <div class="flex items-stretch justify-around px-2 pt-2 pb-1">
        <router-link
          v-for="item in mobileNavItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[56px] transition-colors"
          :class="isActive(item.to) ? 'text-accent-dark dark:text-accent-light' : 'text-zinc-500'"
        >
          <component :is="item.icon" :size="22" :stroke-width="isActive(item.to) ? 2.5 : 2" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Home, BookOpen, Users, Target, User, BarChart3 } from 'lucide-vue-next';
import AppLogo from '../components/ui/AppLogo.vue';
import ThemeToggle from '../components/ui/ThemeToggle.vue';
import { useMemberStore } from '../stores/member';
import { useSettingsStore } from '../stores/settings';
import { getFullMediaUrl } from '../api';

const route = useRoute();
const memberStore = useMemberStore();
const settingsStore = useSettingsStore();

const logoUrl = computed(() => {
  const url = settingsStore.settings?.logo_url;
  return url ? getFullMediaUrl(url) : '';
});

const initials = computed(() => {
  const name = memberStore.displayName || 'M';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
});

const navItems = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/learn', label: 'Learn', icon: BookOpen },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/mentors', label: 'Mentors', icon: Target },
  { to: '/app/progress', label: 'Progress', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: User },
];

const mobileNavItems = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/learn', label: 'Learn', icon: BookOpen },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/mentors', label: 'Mentors', icon: Target },
  { to: '/app/settings', label: 'You', icon: User },
];

const isActive = (path) => route.path === path || route.path.startsWith(path + '/');
</script>
