<template>
  <MemberLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-display font-bold">Community</h1>
          <p class="text-sm text-zinc-500 mt-1">Wins, questions, and accountability</p>
        </div>
        <UiButton variant="primary" size="sm" @click="showComposer = true">
          + Post
        </UiButton>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 nma-scrollbar">
        <UiChip
          v-for="space in spaces"
          :key="space"
          :label="space"
          :selected="activeSpace === space"
          @toggle="activeSpace = space"
        />
      </div>

      <div class="space-y-3">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="nma-card p-4"
          :class="post.isWin ? 'border-accent/40 bg-accent-muted/20 dark:bg-accent/5' : ''"
        >
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full nma-gradient-gold flex items-center justify-center text-sm font-bold text-zinc-900 shrink-0">
              {{ post.author[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm">{{ post.author }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  Lvl {{ post.level }}
                </span>
                <span v-if="post.isWin" class="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark dark:text-accent-light font-bold">
                  🏆 Win
                </span>
                <span class="text-xs text-zinc-400 ml-auto">{{ post.time }}</span>
              </div>
              <p class="text-sm mt-2 leading-relaxed">{{ post.content }}</p>
              <div class="flex gap-4 mt-3 text-xs text-zinc-500">
                <button type="button" class="hover:text-accent transition-colors" @click="post.reactions++">
                  👏 {{ post.reactions }}
                </button>
                <span>💬 {{ post.comments }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Composer modal -->
      <div
        v-if="showComposer"
        class="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-4"
        @click.self="showComposer = false"
      >
        <div class="nma-card w-full max-w-lg p-5 motion-safe:animate-slide-up">
          <h3 class="font-display font-semibold mb-3">Share with the community</h3>
          <textarea
            v-model="newPost"
            rows="4"
            placeholder="Share a win, ask a question..."
            class="nma-input resize-none mb-4"
          />
          <div class="flex gap-2">
            <UiButton variant="ghost" full-width @click="showComposer = false">Cancel</UiButton>
            <UiButton variant="primary" full-width @click="submitPost">Post</UiButton>
          </div>
        </div>
      </div>
    </div>
  </MemberLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MemberLayout from '../../layouts/MemberLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import UiChip from '../../components/ui/UiChip.vue';
import { useMemberStore } from '../../stores/member';
import { COMMUNITY_POSTS } from '../../data/learning';

const memberStore = useMemberStore();
const spaces = ['All', 'Wins', 'Questions', 'Mindset'];
const activeSpace = ref('All');
const posts = ref([...COMMUNITY_POSTS]);
const showComposer = ref(false);
const newPost = ref('');

const filteredPosts = computed(() => {
  if (activeSpace.value === 'All') return posts.value;
  return posts.value.filter((p) => p.space === activeSpace.value);
});

function submitPost() {
  if (!newPost.value.trim()) return;
  posts.value.unshift({
    id: Date.now(),
    author: memberStore.displayName,
    level: memberStore.level,
    space: 'Wins',
    content: newPost.value,
    time: 'Just now',
    reactions: 0,
    comments: 0,
    isWin: true,
  });
  memberStore.completeQuest('community');
  newPost.value = '';
  showComposer.value = false;
}
</script>
