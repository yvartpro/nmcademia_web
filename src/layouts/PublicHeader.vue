<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-200/80 backdrop-blur-xl"
    :class="transparent ? 'bg-transparent' : 'bg-surface-1/90'"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <router-link to="/" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
        <AppLogo :logo-url="logoUrl" :show-tagline="showTagline" />
      </router-link>
      <div class="flex items-center gap-2">
        <UiButton
          v-if="showMemberLink && memberStore.isRegistered"
          variant="ghost"
          size="sm"
          :to="memberStore.journey.defaultRoute"
        >
          My path
        </UiButton>
        <router-link
          v-if="showAdmin"
          to="/admin/login"
          class="text-xs font-medium text-zinc-500 hover:text-zinc-700 px-2 py-1"
        >
          Admin
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import AppLogo from '../components/ui/AppLogo.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useMemberStore } from '../stores/member';

const memberStore = useMemberStore();

defineProps({
  logoUrl: { type: String, default: '' },
  transparent: { type: Boolean, default: false },
  showTagline: { type: Boolean, default: false },
  showMemberLink: { type: Boolean, default: true },
  showAdmin: { type: Boolean, default: true },
});
</script>
