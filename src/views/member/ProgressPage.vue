<template>
  <JourneyLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold">Your Progress</h1>
        <p class="text-sm text-zinc-500 mt-1">{{ progressSubtitle }}</p>
      </div>

      <div v-if="memberStore.canFeature('gamification')" class="nma-card p-6 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full nma-gradient-gold text-2xl font-display font-bold text-zinc-900 mb-3">
          {{ memberStore.level }}
        </div>
        <h2 class="text-lg font-display font-bold">{{ memberStore.levelTitle }}</h2>
        <p class="text-sm text-zinc-500 mt-1">{{ memberStore.xp.toLocaleString() }} XP</p>
        <div class="mt-4 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden max-w-xs mx-auto">
          <div class="h-full nma-gradient-gold rounded-full" :style="{ width: `${memberStore.levelInfo.progress}%` }" />
        </div>
      </div>

      <div v-if="memberStore.canFeature('gamification')" class="grid grid-cols-2 gap-3">
        <div class="nma-card p-4 text-center">
          <Flame :size="22" class="text-streak mx-auto mb-2" />
          <p class="text-xl font-bold text-streak">{{ memberStore.streak }}</p>
          <p class="text-xs text-zinc-500">Day streak</p>
        </div>
        <div class="nma-card p-4 text-center">
          <Trophy :size="22" class="text-accent mx-auto mb-2" />
          <p class="text-xl font-bold">{{ memberStore.profile.bestStreak }}</p>
          <p class="text-xs text-zinc-500">Best streak</p>
        </div>
      </div>

      <section v-if="memberStore.canFeature('courses')">
        <h2 class="font-display font-semibold text-lg mb-3">Course progress</h2>
        <div class="nma-card divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <div
            v-for="course in memberStore.filteredCourses"
            :key="course.id"
            class="p-4 flex items-center gap-3"
          >
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br shrink-0" :class="course.gradient" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ course.title }}</p>
              <div class="mt-1.5 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div class="h-full nma-gradient-gold rounded-full" :style="{ width: `${memberStore.getCourseProgress(course.id)}%` }" />
              </div>
            </div>
            <span class="text-xs font-bold text-zinc-500">{{ memberStore.getCourseProgress(course.id) }}%</span>
          </div>
        </div>
      </section>

      <router-link
        v-if="memberStore.canFeature('certificates')"
        to="/app/certificates"
        class="nma-card p-4 flex items-center justify-between text-sm hover:shadow-glow transition-shadow"
      >
        <span class="font-medium">View certificates</span>
        <span class="text-zinc-400">→</span>
      </router-link>

      <OwnerMentorCard v-if="memberStore.canFeature('ownerMentor')" />
    </div>
  </JourneyLayout>
</template>

<script setup>
import { computed } from 'vue';
import { Flame, Trophy } from 'lucide-vue-next';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import OwnerMentorCard from '../../components/journey/OwnerMentorCard.vue';
import { useMemberStore } from '../../stores/member';
import { JOURNEY_IDS } from '../../data/learnerJourneys';

const memberStore = useMemberStore();

const progressSubtitle = computed(() => {
  if (memberStore.journeyId === JOURNEY_IDS.LEARN) {
    return 'Track your mentorship learning — certificates are not part of this track.';
  }
  if (memberStore.journeyId === JOURNEY_IDS.BUILD) {
    return 'Track skills, XP, and credentials on your leader path.';
  }
  return 'Your learning progress.';
});
</script>
