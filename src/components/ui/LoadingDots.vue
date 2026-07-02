<template>
  <div class="flex items-center justify-center gap-1.5">
    <div
      class="w-2 h-2 rounded-full transition-all duration-300"
      :class="color"
      :style="{ transform: `scaleY(${dot1Scale})` }"
    />
    <div
      class="w-2 h-2 rounded-full transition-all duration-300"
      :class="color"
      :style="{ transform: `scaleY(${dot2Scale})` }"
    />
    <div
      class="w-2 h-2 rounded-full transition-all duration-300"
      :class="color"
      :style="{ transform: `scaleY(${dot3Scale})` }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'bg-accent'
  },
  animationDuration: {
    type: Number,
    default: 600
  }
});

const dot1Scale = ref(0.4);
const dot2Scale = ref(0.4);
const dot3Scale = ref(0.4);

let animationFrame = null;
let startTime = null;

const animate = (currentTime) => {
  if (!startTime) startTime = currentTime;
  const elapsed = currentTime - startTime;
  const progress = (elapsed % props.animationDuration) / props.animationDuration;

  // Each dot animates with a 150ms stagger
  const dot1Progress = (progress * 3) % 1;
  const dot2Progress = ((progress * 3 + 0.33) % 1);
  const dot3Progress = ((progress * 3 + 0.66) % 1);

  // Easing: sine wave for smooth up and down
  dot1Scale.value = 0.4 + Math.sin(dot1Progress * Math.PI) * 0.6;
  dot2Scale.value = 0.4 + Math.sin(dot2Progress * Math.PI) * 0.6;
  dot3Scale.value = 0.4 + Math.sin(dot3Progress * Math.PI) * 0.6;

  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  animationFrame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>
