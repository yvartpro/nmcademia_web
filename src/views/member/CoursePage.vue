<template>
  <JourneyLayout>
    <div v-if="!course" class="nma-card p-8 text-center space-y-4">
      <p class="text-sm text-zinc-500">This course is not on your learning path.</p>
      <UiButton variant="primary" to="/app/training">Back to Training</UiButton>
    </div>

    <div v-else class="space-y-6 motion-safe:animate-fade-in">
      <router-link to="/app/learn" class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ChevronLeft :size="16" /> Back to Learn
      </router-link>

      <!-- Hero -->
      <div class="nma-card overflow-hidden">
        <div class="h-40 sm:h-52 bg-gradient-to-br relative" :class="course.gradient">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <span class="text-[10px] font-bold uppercase tracking-wider text-accent-light">{{ course.category }}</span>
            <h1 class="text-2xl sm:text-3xl font-display font-bold text-white mt-1">{{ course.title }}</h1>
            <p class="text-sm text-white/80 mt-1">{{ course.subtitle }}</p>
          </div>
        </div>
        <div class="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div class="flex gap-4 text-sm text-zinc-500">
            <span>{{ course.lessons }} lessons</span>
            <span>{{ course.duration }}</span>
            <span>★ {{ course.rating }}</span>
            <span class="text-accent font-bold">+{{ course.xp }} XP</span>
          </div>
          <UiButton :to="firstIncompleteLesson" variant="primary">
            {{ progress > 0 ? 'Resume' : 'Start Course' }}
          </UiButton>
        </div>
      </div>

      <!-- About -->
      <section class="nma-card p-5">
        <h2 class="font-display font-semibold mb-2">About This Journey</h2>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{{ course.description }}</p>
      </section>

      <!-- Progress -->
      <div class="flex items-center gap-3">
        <div class="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div class="h-full nma-gradient-gold rounded-full transition-all" :style="{ width: `${progress}%` }" />
        </div>
        <span class="text-sm font-medium">{{ progress }}%</span>
      </div>

      <!-- Lesson list -->
      <section>
        <h2 class="font-display font-semibold text-lg mb-3">Your Path</h2>
        <div class="nma-card divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <router-link
            v-for="(lesson, idx) in lessons"
            :key="lesson.id"
            :to="`/app/learn/${courseId}/${lesson.id}`"
            class="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
              :class="isComplete(lesson.id)
                ? 'bg-success text-white'
                : idx === firstIncompleteIdx
                  ? 'nma-gradient-gold text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'"
            >
              <Check v-if="isComplete(lesson.id)" :size="16" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">{{ lesson.title }}</p>
              <p class="text-xs text-zinc-500">{{ lesson.duration }} min · +{{ lesson.xp }} XP</p>
            </div>
            <Play :size="16" class="text-zinc-400 shrink-0" />
          </router-link>
        </div>
      </section>
    </div>
  </JourneyLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Check, Play } from 'lucide-vue-next';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import { useMemberStore } from '../../stores/member';
import { LESSONS } from '../../data/learning';

const route = useRoute();
const memberStore = useMemberStore();
const courseId = computed(() => route.params.courseId);

const course = computed(() =>
  memberStore.filteredCourses.find((c) => c.id === courseId.value)
);
const lessons = computed(() => LESSONS[courseId.value] || []);
const progress = computed(() => memberStore.getCourseProgress(courseId.value));

const firstIncompleteIdx = computed(() =>
  lessons.value.findIndex((l) => !memberStore.isLessonComplete(courseId.value, l.id))
);

const firstIncompleteLesson = computed(() => {
  const idx = firstIncompleteIdx.value >= 0 ? firstIncompleteIdx.value : 0;
  const lesson = lessons.value[idx];
  return lesson ? `/app/learn/${courseId.value}/${lesson.id}` : `/app/learn/${courseId.value}`;
});

function isComplete(lessonId) {
  return memberStore.isLessonComplete(courseId.value, lessonId);
}
</script>
