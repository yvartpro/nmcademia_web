<template>
  <JourneyLayout>
    <div v-if="lesson && course" class="space-y-4 motion-safe:animate-fade-in -mx-4 sm:mx-0">
      <div class="px-4 sm:px-0 flex items-center gap-2">
        <router-link :to="`/app/learn/${courseId}`" class="text-zinc-500 hover:text-zinc-700">
          <ChevronLeft :size="20" />
        </router-link>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-zinc-500 truncate">{{ course.title }}</p>
          <h1 class="text-sm font-semibold truncate">{{ lesson.title }}</h1>
        </div>
      </div>

      <!-- Video area -->
      <div class="aspect-video bg-zinc-900 relative sm:rounded-xl overflow-hidden">
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white/80">
          <div class="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-3">
            <Play :size="32" class="ml-1" />
          </div>
          <p class="text-sm">Lesson video player</p>
          <p class="text-xs text-white/50 mt-1">{{ lesson.duration }} min</p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div class="h-full bg-accent" :style="{ width: `${watchProgress}%` }" />
        </div>
      </div>

      <div class="px-4 sm:px-0">
        <!-- Tabs -->
        <div class="flex gap-1 border-b border-zinc-200 mb-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px"
            :class="activeTab === tab.id
              ? 'border-accent text-accent-dark'
              : 'border-transparent text-zinc-500'"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'takeaway'" class="nma-card p-5">
          <UiSectionLabel>Key Takeaway</UiSectionLabel>
          <p class="text-sm leading-relaxed mt-3 text-zinc-700">
            {{ takeaway }}
          </p>
        </div>

        <div v-else-if="activeTab === 'notes'" class="nma-card p-5">
          <textarea
            v-model="notes"
            rows="4"
            placeholder="Write your personal notes..."
            class="nma-input resize-none"
          />
        </div>

        <div v-else class="nma-card p-5 text-sm text-zinc-500">
          Questions about this lesson? Message your Academia coach directly.
        </div>

        <!-- Complete -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <UiButton
            variant="primary"
            full-width
            :disabled="completed"
            @click="markComplete"
          >
            <Check v-if="completed" :size="18" />
            {{ completed ? 'Completed' : `Mark Complete · +${lesson.xp} XP` }}
          </UiButton>
          <UiButton
            v-if="nextLesson"
            variant="outline"
            full-width
            :to="`/app/learn/${courseId}/${nextLesson.id}`"
          >
            Next: {{ nextLesson.title }} →
          </UiButton>
        </div>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Play, Check } from 'lucide-vue-next';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import UiSectionLabel from '../../components/ui/UiSectionLabel.vue';
import { useMemberStore } from '../../stores/member';
import { LESSONS } from '../../data/learning';

const route = useRoute();
const memberStore = useMemberStore();

const courseId = computed(() => route.params.courseId);
const lessonId = computed(() => route.params.lessonId);
const course = computed(() => memberStore.courses.find((c) => c.id === courseId.value));
const lessons = computed(() => LESSONS[courseId.value] || []);
const lesson = computed(() => lessons.value.find((l) => l.id === lessonId.value));

const activeTab = ref('takeaway');
const notes = ref('');
const watchProgress = ref(0);
let progressTimer = null;

const tabs = [
  { id: 'takeaway', label: 'Takeaway' },
  { id: 'notes', label: 'Notes' },
  { id: 'discuss', label: 'Discuss' },
];

const takeaways = {
  duplication: 'Duplication beats talent. Your success depends on building systems others can replicate.',
  intro: 'Leadership in network marketing is people development — not product pushing.',
  rejection: 'Rejection is sorting, not failure. Every no brings you closer to the right yes.',
};

const takeaway = computed(() =>
  takeaways[lessonId.value] || 'Apply what you learn today through consistent daily action.'
);

const completed = computed(() =>
  memberStore.isLessonComplete(courseId.value, lessonId.value)
);

const lessonIdx = computed(() => lessons.value.findIndex((l) => l.id === lessonId.value));
const nextLesson = computed(() => lessons.value[lessonIdx.value + 1] || null);

onMounted(() => {
  progressTimer = setInterval(() => {
    if (watchProgress.value < 100) watchProgress.value += 5;
  }, 800);
});

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer);
});

function markComplete() {
  memberStore.completeLesson(courseId.value, lessonId.value);
  if (memberStore.canFeature('gamification')) {
    memberStore.completeQuest('lesson');
  }
}
</script>
