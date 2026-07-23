<template>
  <MemberLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold">Find Your Coach</h1>
        <p class="text-sm text-zinc-500 mt-1">Experienced mentors matched to your journey</p>
      </div>

      <div class="relative">
        <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input v-model="search" type="search" placeholder="Search mentors..." class="nma-input pl-11" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="mentor in filteredMentors"
          :key="mentor.id"
          class="nma-card p-5 hover:shadow-glow transition-shadow"
        >
          <div class="flex gap-4">
            <div class="w-14 h-14 rounded-2xl nma-gradient-gold flex items-center justify-center text-lg font-bold text-zinc-900 shrink-0">
              {{ mentor.name.split(' ')[1]?.[0] || mentor.name[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold">{{ mentor.name }}</h3>
              <p class="text-xs text-accent">{{ mentor.title }}</p>
              <div class="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                <Star :size="12" class="text-accent fill-accent" />
                {{ mentor.rating }}
                <span class="mx-1">·</span>
                {{ mentor.responseTime }}
              </div>
            </div>
          </div>
          <p class="text-sm text-zinc-600 mt-3 line-clamp-2">{{ mentor.bio }}</p>
          <div class="flex flex-wrap gap-1.5 mt-3">
            <span
              v-for="tag in mentor.specialties"
              :key="tag"
              class="text-[10px] px-2 py-1 rounded-lg bg-zinc-100 text-zinc-600"
            >
              {{ tag }}
            </span>
          </div>
          <div class="flex gap-2 mt-4">
            <UiButton variant="primary" size="sm" full-width :to="`/app/mentors/${mentor.id}`">
              View Profile
            </UiButton>
            <UiButton variant="outline" size="sm" @click="joinGroup(settingsStore, 'other')">
              Message
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </MemberLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Star } from 'lucide-vue-next';
import MemberLayout from '../../layouts/MemberLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import { MENTORS } from '../../data/learning';
import { useSettingsStore } from '../../stores/settings';
import { joinGroup } from '../../utils/whatsapp';

const search = ref('');
const settingsStore = useSettingsStore();
const filteredMentors = computed(() => {
  if (!search.value.trim()) return MENTORS;
  const q = search.value.toLowerCase();
  return MENTORS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.specialties.some((s) => s.toLowerCase().includes(q))
  );
});
</script>
