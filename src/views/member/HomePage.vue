<template>
  <MemberLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <!-- Greeting + streak -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm text-zinc-500">{{ greeting }}</p>
          <h1 class="text-2xl sm:text-3xl font-display font-bold text-zinc-900 mt-1">
            {{ memberStore.displayName }}
          </h1>
          <p class="text-sm text-zinc-500 mt-1">
            Level {{ memberStore.level }} · {{ memberStore.levelTitle }}
          </p>
        </div>
        <div class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-streak/10 border border-streak/20">
          <Flame :size="20" class="text-streak" />
          <div class="text-right">
            <p class="text-lg font-bold text-streak leading-none">{{ memberStore.streak }}</p>
            <p class="text-[10px] text-zinc-500">day streak</p>
          </div>
        </div>
      </div>

      <!-- XP ring -->
      <div class="nma-card p-5">
        <div class="flex items-center gap-4">
          <div class="relative w-16 h-16 shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" class="text-zinc-200" stroke-width="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="url(#xpGrad)" stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="`${memberStore.levelInfo.progress * 0.97} 100`"
              />
              <defs>
                <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#D97706" />
                  <stop offset="100%" stop-color="#FBBF24" />
                </linearGradient>
              </defs>
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-xs font-bold">{{ memberStore.level }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ memberStore.xp.toLocaleString() }} XP</p>
            <p class="text-xs text-zinc-500 mt-0.5">
              <template v-if="memberStore.levelInfo.next">
                {{ memberStore.levelInfo.xpForNext - memberStore.levelInfo.xpInLevel }} XP to Level {{ memberStore.levelInfo.next.level }}
              </template>
              <template v-else>Max level reached</template>
            </p>
          </div>
        </div>
      </div>

      <!-- Continue learning -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display font-semibold text-lg">Continue Learning</h2>
          <router-link to="/app/learn" class="text-sm text-brand hover:text-brand-dark">See all</router-link>
        </div>
        <router-link
          :to="`/app/learn/${continueCourse.id}`"
          class="nma-card p-4 flex gap-4 hover:shadow-glow transition-shadow block"
        >
          <div
            class="w-20 h-20 rounded-xl shrink-0 bg-gradient-to-br flex items-center justify-center"
            :class="continueCourse.gradient"
          >
            <BookOpen :size="28" class="text-white/90" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-zinc-900 truncate">{{ continueCourse.title }}</h3>
            <p class="text-xs text-zinc-500 mt-0.5">{{ continueCourse.subtitle }}</p>
            <div class="mt-3 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div class="h-full nma-gradient-gold rounded-full transition-all" :style="{ width: `${continueProgress}%` }" />
            </div>
            <p class="text-xs text-zinc-500 mt-1">{{ continueProgress }}% complete</p>
          </div>
          <Play :size="20" class="text-accent shrink-0 self-center" />
        </router-link>
      </section>

      <!-- Daily quests -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display font-semibold text-lg">Today's Quest</h2>
          <span class="text-xs font-bold text-accent">+XP</span>
        </div>
        <div class="nma-card divide-y divide-zinc-200/80">
          <button
            v-for="quest in memberStore.profile.quests"
            :key="quest.id"
            type="button"
            @click="toggleQuest(quest)"
            class="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 transition-colors"
          >
            <div
              class="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="quest.done ? 'bg-success border-success text-white' : 'border-zinc-300'"
            >
              <Check v-if="quest.done" :size="14" />
            </div>
            <span class="flex-1 text-sm" :class="quest.done ? 'line-through text-zinc-400' : ''">{{ quest.label }}</span>
            <span class="text-xs font-bold text-accent">+{{ quest.xp }}</span>
          </button>
        </div>
      </section>

      <!-- Community pulse -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display font-semibold text-lg">Community Pulse</h2>
          <router-link to="/app/community" class="text-sm text-brand">Join</router-link>
        </div>
        <div class="space-y-2">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="nma-card p-4 flex gap-3"
            :class="post.isWin ? 'border-accent/30' : ''"
          >
            <div class="w-8 h-8 rounded-full nma-gradient-gold flex items-center justify-center text-xs font-bold text-zinc-900 shrink-0">
              {{ post.author[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-zinc-500">{{ post.author }} · {{ post.time }}</p>
              <p class="text-sm mt-1 line-clamp-2">{{ post.content }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recommended -->
      <section>
        <h2 class="font-display font-semibold text-lg mb-3">Recommended For You</h2>
        <div class="flex gap-3 overflow-x-auto pb-2 nma-scrollbar -mx-1 px-1">
          <router-link
            v-for="course in recommended"
            :key="course.id"
            :to="`/app/learn/${course.id}`"
            class="shrink-0 w-40 nma-card overflow-hidden hover:shadow-glow transition-shadow"
          >
            <div class="h-24 bg-gradient-to-br" :class="course.gradient" />
            <div class="p-3">
              <h3 class="text-sm font-semibold line-clamp-2">{{ course.title }}</h3>
              <p class="text-xs text-zinc-500 mt-1">+{{ course.xp }} XP</p>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </MemberLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Flame, BookOpen, Play, Check } from 'lucide-vue-next';
import MemberLayout from '../../layouts/MemberLayout.vue';
import { useMemberStore } from '../../stores/member';
import { COMMUNITY_POSTS } from '../../data/learning';

const memberStore = useMemberStore();

onMounted(() => memberStore.checkDailyStreak());

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
});

const continueCourse = computed(() => memberStore.continueCourse);
const continueProgress = computed(() => memberStore.continueProgress);
const recentPosts = COMMUNITY_POSTS.slice(0, 2);
const recommended = computed(() => memberStore.courses.filter((c) => c.id !== continueCourse.value.id).slice(0, 3));

function toggleQuest(quest) {
  if (!quest.done) memberStore.completeQuest(quest.id);
}
</script>
