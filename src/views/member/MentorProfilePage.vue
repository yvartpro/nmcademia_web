<template>
  <MemberLayout>
    <div v-if="mentor" class="space-y-6 motion-safe:animate-fade-in">
      <router-link to="/app/mentors" class="inline-flex items-center gap-1 text-sm text-zinc-500">
        <ChevronLeft :size="16" /> All Mentors
      </router-link>

      <div class="nma-card overflow-hidden">
        <div class="h-32 nma-gradient-mesh relative">
          <div class="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl nma-gradient-gold flex items-center justify-center text-2xl font-bold text-zinc-900 border-4 border-surface-1">
            {{ mentor.name.split(' ')[1]?.[0] || 'C' }}
          </div>
        </div>
        <div class="pt-12 p-6">
          <h1 class="text-2xl font-display font-bold">{{ mentor.name }}</h1>
          <p class="text-accent font-medium">{{ mentor.title }}</p>
          <div class="flex items-center gap-3 mt-2 text-sm text-zinc-500">
            <span class="flex items-center gap-1"><Star :size="14" class="text-accent fill-accent" /> {{ mentor.rating }}</span>
            <span>Responds {{ mentor.responseTime }}</span>
          </div>
          <p class="text-sm text-zinc-600 mt-4 leading-relaxed">{{ mentor.bio }}</p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="nma-card p-5">
          <h3 class="text-sm font-semibold mb-2">Specialties</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="s in mentor.specialties" :key="s" class="text-xs px-3 py-1.5 rounded-xl bg-accent/10 text-accent-dark">
              {{ s }}
            </span>
          </div>
        </div>
        <div class="nma-card p-5">
          <h3 class="text-sm font-semibold">Languages</h3>
          <p class="text-sm text-zinc-500 mt-2">{{ mentor.languages.join(', ') }}</p>
        </div>
      </div>

      <div v-if="matchScore" class="nma-card p-5 border-accent/30">
        <p class="text-sm"><span class="font-bold text-accent">{{ matchScore }}% match</span> based on your onboarding profile</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <UiButton variant="primary" full-width @click="bookSession">Book Session</UiButton>
        <UiButton variant="outline" full-width @click="openWhatsApp">Send Message</UiButton>
      </div>
    </div>
  </MemberLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Star } from 'lucide-vue-next';
import MemberLayout from '../../layouts/MemberLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import { useMemberStore } from '../../stores/member';
import { MENTORS } from '../../data/learning';

const route = useRoute();
const memberStore = useMemberStore();

const mentor = computed(() => MENTORS.find((m) => m.id === route.params.id));

const matchScore = computed(() => {
  if (!mentor.value) return null;
  const profile = memberStore.profile.profileType?.toLowerCase() || '';
  const hasMatch = mentor.value.matchTags.some((t) => profile.includes(t.split(' ')[0]));
  return hasMatch ? 92 : 78;
});

function openWhatsApp() {
  const text = encodeURIComponent(`Hello ${mentor.value.name}, I'd like to book a mentorship session.`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function bookSession() {
  memberStore.completeQuest('mentor');
  openWhatsApp();
}
</script>
