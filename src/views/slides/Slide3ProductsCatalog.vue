<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <h2 class="text-2xl sm:text-3xl font-display font-black">World-Class Health & Wellness</h2>

    <div class="aspect-video bg-white rounded-2xl overflow-hidden shadow-glow border border-zinc-200">
      <iframe
        v-if="settings['video_url']"
        :src="settings['video_url']"
        title="Presentation Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-full"
      />
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
        Video presentation goes here
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="nma-card p-5 flex flex-col items-center text-center hover:border-accent transition duration-300"
      >
        <div class="w-20 h-20 bg-zinc-50 rounded-2xl p-2 border border-zinc-250/20 mb-3 flex items-center justify-center">
          <img
            v-if="product.image"
            :src="getFullMediaUrl(product.image)"
            :alt="product.name"
            class="w-full h-full object-contain"
          />
        </div>
        <h4 class="font-extrabold text-sm text-zinc-900">{{ product.name }}</h4>
        <p class="text-xs text-zinc-500 line-clamp-2 mt-2 font-light">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFullMediaUrl } from '../../api';

defineProps({
  settings: { type: Object, required: true },
  products: { type: Array, default: () => [] },
});
</script>
