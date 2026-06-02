<template>
  <JourneyLayout>
    <div class="space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold">Certificates</h1>
        <p class="text-sm text-zinc-500 mt-1">Earned on the Leader Development path</p>
      </div>

      <div v-if="certificates.length === 0" class="nma-card p-8 text-center">
        <Award :size="48" class="text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
        <h3 class="font-semibold">No certificates yet</h3>
        <p class="text-sm text-zinc-500 mt-2">Complete a course to earn your credential.</p>
        <UiButton variant="primary" class="mt-4" to="/app/training">Go to Training</UiButton>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="cert in certificates"
          :key="cert.id"
          class="nma-card p-6 border-2 border-accent/30"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Network Marketing Academia</p>
          <h3 class="text-lg font-display font-bold mt-2">Certificate of Completion</h3>
          <p class="text-xl font-semibold mt-3 nma-gradient-text">{{ cert.courseTitle }}</p>
          <p class="text-sm text-zinc-500 mt-4">Awarded to <strong>{{ cert.recipient }}</strong></p>
          <p class="text-xs text-zinc-400 mt-1">{{ cert.date }} · {{ cert.id }}</p>
          <UiButton variant="outline" size="sm" class="mt-4" @click="shareCert(cert)">Share</UiButton>
        </div>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup>
import { computed } from 'vue';
import { Award } from 'lucide-vue-next';
import JourneyLayout from '../../layouts/JourneyLayout.vue';
import UiButton from '../../components/ui/UiButton.vue';
import { useMemberStore } from '../../stores/member';

const memberStore = useMemberStore();
const certificates = computed(() => memberStore.profile.certificates);

function shareCert(cert) {
  const text = encodeURIComponent(`I earned my ${cert.courseTitle} certificate from Network Marketing Academia!`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}
</script>
