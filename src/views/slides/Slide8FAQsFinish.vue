<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <UiSectionLabel>Slide 8: Frequently Asked Questions</UiSectionLabel>
    <h2 class="text-2xl sm:text-3xl font-display font-black">Answers to Common Questions</h2>

    <input
      v-model="searchQuery"
      type="search"
      placeholder="Search question keywords…"
      class="nma-input-glass"
    />

    <div class="nma-card overflow-hidden divide-y divide-zinc-200/50">
      <div v-for="faq in filteredFAQs" :key="faq.id" class="transition-colors">
        <button
          type="button"
          @click="toggleFAQ(faq.id)"
          class="w-full text-left p-4 flex items-center justify-between hover:bg-zinc-100 transition"
        >
          <span class="font-bold text-xs sm:text-sm text-zinc-900 pr-4">{{ faq.question }}</span>
          <ChevronDown
            :size="16"
            class="text-zinc-400 shrink-0 transition-transform"
            :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
          />
        </button>
        <div
          v-if="openFAQs.includes(faq.id)"
          class="px-4 pb-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-light whitespace-pre-line animate-fade-in"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>

    <!-- CTA Card -->
    <div class="nma-card p-6 sm:p-8 text-center space-y-5 border-accent/30 bg-gradient-to-br from-indigo-950/20 to-accent/5">
      <h3 class="font-display font-extrabold text-xl text-accent">{{ finishTitle }}</h3>
      <p class="text-xs sm:text-sm text-zinc-650 max-w-lg mx-auto">{{ finishMessage }}</p>

      <div v-if="showOwnerMentor" class="text-left pt-2">
        <OwnerMentorCard cta-label="Contact Coordinator Coach" />
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <UiButton variant="primary" @click="$emit('consult', { name: 'Enrollment Request' })">
          Message Coordinator (WhatsApp)
        </UiButton>
        <UiButton v-if="showTrainingLink" variant="outline" to="/app/training">
          Continue to Training →
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import UiSectionLabel from '../../components/ui/UiSectionLabel.vue';
import UiButton from '../../components/ui/UiButton.vue';
import OwnerMentorCard from '../../components/journey/OwnerMentorCard.vue';

const props = defineProps({
  faqs: { type: Array, default: () => [] },
  finishTitle: { type: String, default: '' },
  finishMessage: { type: String, default: '' },
  showOwnerMentor: { type: Boolean, default: false },
  showTrainingLink: { type: Boolean, default: false },
});

defineEmits(['consult']);

const searchQuery = ref('');
const openFAQs = ref([]);

const filteredFAQs = computed(() => {
  if (!searchQuery.value) return props.faqs;
  const q = searchQuery.value.toLowerCase();
  return props.faqs.filter(f =>
    f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});

const toggleFAQ = (id) => {
  const idx = openFAQs.value.indexOf(id);
  if (idx === -1) openFAQs.value.push(id);
  else openFAQs.value.splice(idx, 1);
};
</script>
