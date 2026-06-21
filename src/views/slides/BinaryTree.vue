<template>
  <!-- Custom image -->
  <div v-if="imageUrl" :class="size === 'lg' ? 'max-w-3xl' : 'max-w-xl'">
    <img :src="imageUrl" alt="Binary Tree Diagram" class="w-full h-auto object-contain rounded-lg shadow-glow" />
  </div>

  <!-- CSS fallback tree -->
  <div v-else class="flex flex-col items-center">
    <div :class="size === 'lg' ? 'px-6 py-3 text-sm' : 'px-5 py-2.5 text-xs'" class="bg-accent text-slate-900 font-black rounded-xl tracking-wider shadow-glow">YOU</div>
    <div :class="size === 'lg' ? 'h-8' : 'h-6'" class="w-0.5 bg-zinc-700"></div>

    <div :class="size === 'lg' ? 'w-80' : 'w-64'" class="border-t border-zinc-700 flex justify-between">
      <div :class="size === 'lg' ? 'h-8' : 'h-6'" class="w-0.5 bg-zinc-700"></div>
      <div :class="size === 'lg' ? 'h-8' : 'h-6'" class="w-0.5 bg-zinc-700"></div>
    </div>

    <div :class="size === 'lg' ? 'w-[500px] gap-12' : 'w-[360px] gap-6'" class="flex justify-between">
      <!-- Left Branch -->
      <div class="flex flex-col items-center">
        <div :class="size === 'lg' ? 'px-5 py-2.5 text-xs' : 'px-4 py-2 text-xs'" class="bg-brand text-white font-bold rounded-lg shadow">Alex (Left Branch)</div>
        <div :class="size === 'lg' ? 'h-8' : 'h-6'" class="w-0.5 bg-zinc-700"></div>
        <div :class="size === 'lg' ? 'w-36' : 'w-28'" class="border-t border-zinc-700 flex justify-between">
          <div :class="size === 'lg' ? 'h-6' : 'h-4'" class="w-0.5 bg-zinc-700"></div>
          <div :class="size === 'lg' ? 'h-6' : 'h-4'" class="w-0.5 bg-zinc-700"></div>
        </div>
        <div :class="size === 'lg' ? 'w-40 text-xs' : 'w-32 text-[10px]'" class="flex justify-between font-semibold text-zinc-400">
          <span :class="size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1'" class="bg-white rounded border border-zinc-200/50">Bryan</span>
          <span :class="size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1'" class="bg-white rounded border border-zinc-200/50">Chris</span>
        </div>
      </div>

      <!-- Match Bonus Badge -->
      <div :class="size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'" class="self-center z-10 -my-4 bg-accent/20 border border-accent/40 text-accent font-black rounded-full shadow-glow">
        $32 MATCH PAIR
      </div>

      <!-- Right Branch -->
      <div class="flex flex-col items-center">
        <div :class="size === 'lg' ? 'px-5 py-2.5 text-xs' : 'px-4 py-2 text-xs'" class="bg-brand text-white font-bold rounded-lg shadow">Bella (Right Branch)</div>
        <div :class="size === 'lg' ? 'h-8' : 'h-6'" class="w-0.5 bg-zinc-700"></div>
        <div :class="size === 'lg' ? 'w-36' : 'w-28'" class="border-t border-zinc-700 flex justify-between">
          <div :class="size === 'lg' ? 'h-6' : 'h-4'" class="w-0.5 bg-zinc-700"></div>
          <div :class="size === 'lg' ? 'h-6' : 'h-4'" class="w-0.5 bg-zinc-700"></div>
        </div>
        <div :class="size === 'lg' ? 'w-40 text-xs' : 'w-32 text-[10px]'" class="flex justify-between font-semibold text-zinc-400">
          <span :class="size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1'" class="bg-white rounded border border-zinc-200/50">Daniela</span>
          <span :class="size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1'" class="bg-white rounded border border-zinc-200/50">Ella</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: { type: String, default: null },
  size: { type: String, default: 'sm' }, // 'sm' | 'lg'
});
</script>
