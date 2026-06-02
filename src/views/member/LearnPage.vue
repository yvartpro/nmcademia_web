<template>
  <MemberLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold">Learn</h1>
        <p class="text-sm text-zinc-500 mt-1">Your personalized learning journey</p>
      </div>

      <div class="relative">
        <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Search courses, topics..."
          class="nma-input pl-11"
        />
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 nma-scrollbar">
        <UiChip
          v-for="cat in categories"
          :key="cat"
          :label="cat"
          :selected="activeCategory === cat"
          @toggle="activeCategory = activeCategory === cat ? null : cat"
        />
      </div>

      <section v-for="group in courseGroups" :key="group.title">
        <h2 class="font-display font-semibold text-lg mb-3">{{ group.title }}</h2>
        <div class="flex gap-3 overflow-x-auto pb-2 nma-scrollbar -mx-1 px-1">
          <router-link
            v-for="course in group.courses"
            :key="course.id"
            :to="`/app/learn/${course.id}`"
            class="shrink-0 w-44 sm:w-52 nma-card overflow-hidden hover:shadow-glow transition-all hover:-translate-y-0.5"
          >
            <div class="h-28 bg-gradient-to-br relative" :class="course.gradient">
              <div v-if="memberStore.getCourseProgress(course.id) > 0" class="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div class="h-full bg-white/80" :style="{ width: `${memberStore.getCourseProgress(course.id)}%` }" />
              </div>
            </div>
            <div class="p-3">
              <span class="text-[10px] font-bold uppercase tracking-wider text-accent">{{ course.category }}</span>
              <h3 class="text-sm font-semibold mt-1 line-clamp-2">{{ course.title }}</h3>
              <div class="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                <span>{{ course.lessons }} lessons</span>
                <span>·</span>
                <span>★ {{ course.rating }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </MemberLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import MemberLayout from '../../layouts/MemberLayout.vue';
import UiChip from '../../components/ui/UiChip.vue';
import { useMemberStore } from '../../stores/member';

const memberStore = useMemberStore();
const search = ref('');
const activeCategory = ref(null);

const categories = ['All', 'Beginner', 'Leadership', 'Mindset', 'Skills'];

const filteredCourses = computed(() => {
  let list = memberStore.courses;
  if (activeCategory.value && activeCategory.value !== 'All') {
    list = list.filter((c) => c.category === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  }
  return list;
});

const courseGroups = computed(() => [
  { title: 'For You', courses: filteredCourses.value },
  {
    title: 'Quick Wins (< 2h)',
    courses: filteredCourses.value.filter((c) => parseFloat(c.duration) < 2),
  },
]);
</script>
