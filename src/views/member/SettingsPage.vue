<template>
  <JourneyLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold">Settings</h1>
        <p class="text-sm text-zinc-500 mt-1">{{ memberStore.journey.title }}</p>
      </div>

      <section class="nma-card divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
        <div class="p-4 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl nma-gradient-gold flex items-center justify-center text-xl font-bold text-zinc-900">
            {{ initials }}
          </div>
          <div>
            <p class="font-semibold">{{ memberStore.displayName }}</p>
            <p class="text-sm text-zinc-500">{{ memberStore.profile.email || 'No email' }}</p>
            <p class="text-xs text-zinc-500 mt-1">{{ memberStore.profile.profileType }}</p>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Full Name</label>
            <input v-model="form.fullName" type="text" class="nma-input mt-1" />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</label>
            <input v-model="form.email" type="email" class="nma-input mt-1" />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone</label>
            <input v-model="form.phone" type="tel" class="nma-input mt-1" />
          </div>
          <UiButton variant="secondary" size="sm" @click="saveProfile">Save Profile</UiButton>
        </div>
      </section>

      <section class="nma-card p-4">
        <h3 class="text-sm font-semibold mb-3">Appearance</h3>
        <div class="flex gap-2">
          <button
            v-for="mode in themeModes"
            :key="mode.id"
            type="button"
            @click="setTheme(mode.id)"
            class="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            :class="currentTheme === mode.id
              ? 'border-accent bg-accent/10 text-accent-dark dark:text-accent-light'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'"
          >
            {{ mode.label }}
          </button>
        </div>
      </section>

      <section class="nma-card divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
        <router-link
          v-if="memberStore.canFeature('presentation')"
          to="/presentation"
          class="flex items-center justify-between p-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          Partner presentation <span class="text-zinc-400">→</span>
        </router-link>
        <router-link
          v-if="memberStore.canFeature('courses')"
          to="/app/training"
          class="flex items-center justify-between p-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          Training <span class="text-zinc-400">→</span>
        </router-link>
        <router-link
          v-if="memberStore.canFeature('progress')"
          to="/app/progress"
          class="flex items-center justify-between p-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          Progress <span class="text-zinc-400">→</span>
        </router-link>
        <router-link
          v-if="memberStore.canFeature('certificates')"
          to="/app/certificates"
          class="flex items-center justify-between p-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          Certificates <span class="text-zinc-400">→</span>
        </router-link>
      </section>

      <OwnerMentorCard v-if="memberStore.canFeature('ownerMentor')" />

      <UiButton variant="ghost" full-width @click="signOut">Sign Out</UiButton>
    </div>
  </JourneyLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import OwnerMentorCard from '../../components/journey/OwnerMentorCard.vue';
import { useMemberStore } from '../../stores/member';

const router = useRouter();
const memberStore = useMemberStore();

const form = reactive({
  fullName: memberStore.profile.fullName,
  email: memberStore.profile.email,
  phone: localStorage.getItem('chat_visitor_phone') || '',
});

const initials = computed(() =>
  (form.fullName || 'M').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
);

const themeModes = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

const currentTheme = ref(localStorage.getItem('theme') || 'system');

function setTheme(mode) {
  currentTheme.value = mode;
  if (mode === 'system') {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } else {
    localStorage.setItem('theme', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}

function saveProfile() {
  memberStore.profile.fullName = form.fullName;
  memberStore.profile.email = form.email;
  memberStore.persist();
  localStorage.setItem('chat_visitor_name', form.fullName);
  localStorage.setItem('chat_visitor_email', form.email);
}

function signOut() {
  localStorage.removeItem('nma_member_profile');
  router.push('/');
}
</script>
