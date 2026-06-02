<template>
  <div class="nma-card p-5 border-accent/25 bg-accent-muted/20 dark:bg-accent/5">
    <div class="flex gap-4">
      <div class="w-12 h-12 rounded-xl nma-gradient-gold flex items-center justify-center shrink-0">
        <GraduationCap :size="22" class="text-zinc-900" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] font-bold uppercase tracking-wider text-accent">Your Academia Coach</p>
        <h3 class="font-display font-semibold text-zinc-900 dark:text-white mt-0.5">
          {{ coachName }}
        </h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
    <UiButton variant="primary" full-width class="mt-4" @click="contactCoach">
      {{ ctaLabel }}
    </UiButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { GraduationCap } from 'lucide-vue-next';
import UiButton from '../ui/UiButton.vue';
import { useSettingsStore } from '../../stores/settings';
import { useCatalogStore } from '../../stores/catalog';

const props = defineProps({
  message: { type: String, default: '' },
  ctaLabel: { type: String, default: 'Message Your Coach' },
});

const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();

const coachName = computed(
  () => settingsStore.settings?.coach_name || settingsStore.settings?.site_owner_name || 'Network Marketing Academia'
);

const description = computed(
  () =>
    props.message
    || settingsStore.settings?.coach_bio
    || 'Your mentor is the founder of this Academia — one dedicated coach, not a marketplace of strangers.'
);

function contactCoach() {
  const number =
    catalogStore.selectedCountry?.whatsappNumber
    || settingsStore.settings?.whatsapp_number
    || '';
  const text = encodeURIComponent(
    props.message
    || 'Hello, I am learning through Network Marketing Academia and would like mentorship guidance.'
  );
  if (number) {
    window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${text}`, '_blank');
  }
}
</script>
