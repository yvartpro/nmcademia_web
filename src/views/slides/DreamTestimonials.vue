<template>
  <div class="space-y-6">
    <h3 class="text-lg font-bold font-display">Other Success Stories</h3>
    <h4 class="text-sm text-zinc-500">Real People. Real Results. Across Africa and Beyond.</h4>
    
    <p class="text-sm text-zinc-600">
      Discover inspiring stories from ambassadors who have transformed their lives by leveraging our simple, proven, and duplicatable business-building system. See how ordinary people are achieving extraordinary results and creating lasting income through the power of network marketing.
    </p>

    <!-- Grille des témoignages textuels -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="test in textTestimonials" 
        :key="test.id" 
        class="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm flex flex-col justify-between"
      >
        <div class="space-y-3">
          <!-- Icône avec les initiales -->
          <div class="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-bold text-xs">
            {{ getInitials(test.name) }}
          </div>
          <p class="text-base text-zinc-700 italic">"{{ test.quote }}"</p>
        </div>
        <div class="mt-4 pt-3 border-t border-zinc-50">
          <h4 class="font-bold text-sm text-zinc-900">{{ test.name }}</h4>
          <span v-if="test.lifestyleTag" class="text-xs text-zinc-400">{{ test.lifestyleTag }}</span>
        </div>
      </div>

      <!-- État vide si aucun témoignage -->
      <div 
        v-if="textTestimonials.length === 0" 
        class="col-span-full p-8 text-center text-zinc-400 bg-zinc-50 rounded"
      >
        No text testimonials available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useContentStore } from '../../stores/content';

const contentStore = useContentStore();

// Solution : Filtrer pour exclure les vidéos et la propriété hasVideo
const textTestimonials = computed(() => {
  return (contentStore.testimonials || []).filter(t => 
    !t.hasVideo && (!t.video || !t.video.filePath)
  );
});

// Générateur d'initiales pour l'avatar de remplacement
const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
</script>
