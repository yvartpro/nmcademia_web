<template>
  <JourneyLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div
        v-if="showPostSignupWelcome"
        class="nma-card p-4 border-accent/40 bg-accent-muted/30 dark:bg-accent/10 motion-safe:animate-fade-in"
      >
        <p class="text-sm font-medium text-zinc-900 dark:text-white">
          Welcome to your mentorship track. Start with the curriculum below — your coach is here to guide you.
        </p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-accent">{{ journey.title }}</p>
        <h1 class="text-2xl sm:text-3xl font-display font-bold mt-1">
          {{ greeting }}, {{ memberStore.displayName.split(' ')[0] }}
        </h1>
        <p class="text-sm text-zinc-500 mt-2">{{ journey.subtitle }}</p>
      </div>

      <OwnerMentorCard
        v-if="journey.features.ownerMentor"
        :message="coachMessage"
      />

      <!-- Continue (if in progress) -->
      <section v-if="continueCourse && continueProgress > 0">
        <h2 class="font-display font-semibold mb-3">Continue</h2>
        <router-link
          :to="`/app/learn/${continueCourse.id}`"
          class="nma-card-glass p-4 flex gap-4 hover:shadow-glow hover:scale-[1.01] hover:border-accent/30 transition-all duration-305 block"
        >
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br shrink-0" :class="continueCourse.gradient" />
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold truncate">{{ continueCourse.title }}</h3>
            <div class="mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div class="h-full nma-gradient-gold rounded-full" :style="{ width: `${continueProgress}%` }" />
            </div>
            <p class="text-xs text-zinc-500 mt-1">{{ continueProgress }}% complete</p>
          </div>
        </router-link>
      </section>

      <!-- Course list -->
      <section>
        <h2 class="font-display font-semibold mb-3">Your curriculum</h2>
        <p class="text-sm text-zinc-500 mb-4">
          {{ curriculumHint }}
        </p>
        <div class="space-y-3">
          <router-link
            v-for="course in filteredCourses"
            :key="course.id"
            :to="`/app/learn/${course.id}`"
            class="nma-card-glass p-4 flex gap-4 hover:shadow-glow hover:scale-[1.01] hover:border-accent/30 transition-all duration-305 block"
          >
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br shrink-0" :class="course.gradient" />
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold uppercase text-accent">{{ course.category }}</span>
              <h3 class="font-semibold text-sm mt-0.5">{{ course.title }}</h3>
              <p class="text-xs text-zinc-500 line-clamp-1">{{ course.subtitle }}</p>
              <div v-if="memberStore.getCourseProgress(course.id) > 0" class="mt-2 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div class="h-full nma-gradient-gold rounded-full" :style="{ width: `${memberStore.getCourseProgress(course.id)}%` }" />
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <p v-if="journey.features.progress && !journey.features.certificates" class="text-xs text-zinc-500 text-center">
        This track focuses on mentorship and skill-building — no formal certificates.
      </p>
    </div>
  </JourneyLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import OwnerMentorCard from '../../components/journey/OwnerMentorCard.vue';
import { useMemberStore } from '../../stores/member';
import { JOURNEY_IDS } from '../../data/learnerJourneys';

const memberStore = useMemberStore();
const showPostSignupWelcome = ref(false);

onMounted(() => {
  memberStore.checkDailyStreak();
  if (sessionStorage.getItem('nma_post_signup_journey') === JOURNEY_IDS.LEARN) {
    showPostSignupWelcome.value = true;
    sessionStorage.removeItem('nma_post_signup_journey');
  }
});

const journey = computed(() => memberStore.journey);

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
});

const continueCourse = computed(() => memberStore.continueCourse);
const continueProgress = computed(() => memberStore.continueProgress);

const curriculumHint = computed(() => {
  if (memberStore.journeyId === JOURNEY_IDS.LEARN) {
    return 'Courses selected for learners new to the industry or seeking guided mentorship.';
  }
  if (memberStore.journeyId === JOURNEY_IDS.BUILD) {
    return 'Advanced modules for distributors growing leadership and duplication.';
  }
  return 'Your assigned learning modules.';
});

const filteredCourses = computed(() => {
  const id = memberStore.journeyId;
  if (id === JOURNEY_IDS.BUILD) return memberStore.courses;
  if (id === JOURNEY_IDS.LEARN) {
    return memberStore.courses.filter((c) =>
      ['Beginner', 'Mindset', 'Skills'].includes(c.category)
    );
  }
  return memberStore.courses;
});

const coachMessage = computed(() => {
  if (memberStore.journeyId === JOURNEY_IDS.LEARN) {
    return 'As you complete lessons, reach out anytime — your coach will guide you through the mentorship track.';
  }
  return 'You are on the leader development path. Your coach supports your growth and duplication systems.';
});
</script>
