<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <h2 class="text-2xl sm:text-3xl font-display font-black">Matched Sales Binary Model</h2>

    <div class="p-5 bg-white border border-zinc-200 rounded-xl space-y-4">
      <p class="text-xs sm:text-sm text-zinc-600 leading-relaxed">
        A <strong>Binary Structure</strong> means you build only two sides: a <strong>Left Team</strong> and a
        <strong>Right Team</strong>. Every time you place a package referral on the Left and another on the Right,
        they pair to generate a <strong>Pairing Match Bonus (MSB)</strong>.
      </p>

      <div class="space-y-3">
        <!-- Controls Bar -->
        <div class="flex items-center justify-between bg-white border border-zinc-200/50 p-2 rounded-xl text-xs">
          <span class="font-semibold text-zinc-500 uppercase tracking-wider pl-2">Genealogy Visualizer</span>
          <div class="flex items-center gap-1">
            <button type="button" @click="zoomOut" class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600" title="Zoom Out">
              <ZoomOut :size="16" />
            </button>
            <span class="w-12 text-center font-mono font-bold text-zinc-750">{{ Math.round(zoom * 100) }}%</span>
            <button type="button" @click="zoomIn" class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600" title="Zoom In">
              <ZoomIn :size="16" />
            </button>
            <button type="button" @click="resetZoom" class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600" title="Reset Zoom">
              <RotateCcw :size="16" />
            </button>
            <div class="h-4 w-px bg-zinc-300 mx-1" />
            <button type="button" @click="toggleFullscreen" class="p-2 hover:bg-zinc-200 rounded-lg transition text-zinc-600" title="Toggle Fullscreen">
              <Maximize2 :size="16" />
            </button>
          </div>
        </div>

        <!-- Viewport -->
        <div class="relative w-full max-h-[400px] overflow-auto border border-zinc-250/20 rounded-xl bg-white select-none py-10">
          <div
            class="flex justify-center transition-transform duration-150 ease-out origin-top min-w-max px-8"
            :style="{ transform: `scale(${zoom})` }"
          >
            <BinaryTree :image-url="settings?.['binary_tree_image'] ? getFullMediaUrl(settings['binary_tree_image']) : null" />
          </div>
        </div>

        <!-- Fullscreen Modal -->
        <div v-if="isFullscreen" class="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col motion-safe:animate-fade-in">
          <div class="flex items-center justify-between border-b border-zinc-200/30 p-4 bg-white/80">
            <span class="text-sm font-bold text-zinc-900">Genealogy Diagram (Fullscreen)</span>
            <div class="flex items-center gap-2">
              <button type="button" @click="zoomOut" class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700"><ZoomOut :size="18" /></button>
              <span class="w-12 text-center font-mono font-bold text-zinc-500">{{ Math.round(zoom * 100) }}%</span>
              <button type="button" @click="zoomIn" class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700"><ZoomIn :size="18" /></button>
              <button type="button" @click="resetZoom" class="p-2.5 hover:bg-zinc-200 rounded-lg text-zinc-700"><RotateCcw :size="18" /></button>
              <div class="h-5 w-px bg-zinc-700 mx-2" />
              <button type="button" @click="toggleFullscreen" class="px-4 py-2 bg-accent hover:bg-accent-light text-zinc-900 font-extrabold rounded-xl transition text-xs">
                Exit Fullscreen
              </button>
            </div>
          </div>
          <div class="flex-grow overflow-auto flex items-start justify-center p-8 cursor-grab active:cursor-grabbing">
            <div class="transition-transform duration-150 ease-out origin-top py-12" :style="{ transform: `scale(${zoom})` }">
              <BinaryTree
                :image-url="settings?.['binary_tree_image'] ? getFullMediaUrl(settings['binary_tree_image']) : null"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Earning Streams -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Earning Streams Breakdown</h3>
      </div>
      <p class="text-xs text-zinc-400">Click on any earning stream to show detailed explanations and dynamic calculators.</p>

      <div class="space-y-3">
        <div
          v-for="stream in earningStreams"
          :key="stream.id"
          @click="toggleStream(stream.id)"
          class="nma-card p-5 flex flex-col gap-4 hover:border-accent transition duration-300 cursor-pointer"
          :class="{ 'border-accent ring-1 ring-accent bg-white/95': focusedStreamId === stream.id }"
        >
          <div v-if="stream.media && focusedStreamId === stream.id" class="mt-3">
            <img v-if="stream.mediaType === 'image'" :src="mediaPreview(stream.media.filePath)" :alt="stream.media.alt" class="w-full h-full object-cover rounded" />
            <a v-else-if="stream.mediaType === 'video'" @click.stop="openVideo(stream)" class="text-blue-500 hover:underline">Play Video</a>
          </div>

          <div class="flex gap-4">
            <span class="text-2xl">{{ stream.icon || '💰' }}</span>
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <h4 class="font-extrabold text-sm" :class="focusedStreamId === stream.id ? 'text-accent' : 'text-zinc-900'">
                  {{ stream.title }}
                </h4>
                <span class="text-[10px] text-zinc-500 font-semibold">
                  {{ focusedStreamId === stream.id ? 'Hide Details' : 'Show Details' }}
                </span>
              </div>
              <p class="text-xs text-zinc-500 leading-relaxed mt-1 font-light">{{ stream.shortDescription }}</p>
              <p v-if="stream.longDescription && focusedStreamId === stream.id" class="text-[10px] text-zinc-400 mt-2 border-t border-zinc-200/50 pt-2 font-light">
                {{ stream.longDescription }}
              </p>
            </div>
          </div>

          <!-- Stream Simulators -->
          <div v-if="focusedStreamId === stream.id" @click.stop class="border-t border-white/5 pt-4 mt-2">
            <!-- DRB Simulator -->
            <div v-if="stream.slug === 'drb'" class="space-y-4">
              <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Direct Referral Income</h5>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select referral package level:</label>
                  <select v-model="drbPkgId" class="w-full bg-white border border-zinc-200 rounded p-2 text-xs text-zinc-900">
                    <option v-for="p in packages" :key="p.id" :value="p.id">
                      {{ p.name }} (Referral bonus: {{ currencySymbol }}{{ getPriceForCountry(p, 'referralBonus') }})
                    </option>
                  </select>
                </div>
                <div class="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                  <span class="font-bold text-zinc-350">Total DRB Earnings:</span>
                  <span class="font-mono text-base font-black text-amber-400">{{ currencySymbol }}{{ formatNumber(simulatedDRB) }}</span>
                </div>
              </div>
            </div>

            <!-- MSB Simulator -->
            <div v-else-if="stream.slug === 'msb'" class="space-y-4">
              <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Matched Sales (Pairing) Income</h5>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select structural package level:</label>
                  <select v-model="msbPkgId" class="w-full bg-white border border-zinc-200 rounded p-2 text-xs text-zinc-900">
                    <option v-for="p in packages" :key="p.id" :value="p.id">
                      {{ p.name }} (Pair bonus: {{ currencySymbol }}{{ getPriceForCountry(p, 'matchBonus') }})
                    </option>
                  </select>
                </div>
                <div class="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                  <span class="font-bold text-zinc-350">Total MSB Earnings:</span>
                  <span class="font-mono text-base font-black text-amber-400">{{ currencySymbol }}{{ formatNumber(simulatedMSB) }}</span>
                </div>
              </div>
            </div>

            <!-- Stairstep Matrix -->
            <div v-else-if="stream.slug === 'stairstep'" class="space-y-4">
              <h5 class="text-xs font-bold text-accent uppercase tracking-wider">Stairstep Rank Promotions Matrix</h5>
              <div class="space-y-2 text-[10px]">
                <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                  <span class="font-bold text-zinc-300">Silver Executive</span>
                  <span class="text-accent font-black">10 Points Required (Get +10% rebate)</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                  <span class="font-bold text-zinc-300">Gold Executive</span>
                  <span class="text-accent font-black">100 Points Required (Get +20% rebate)</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-white rounded border border-zinc-200/50">
                  <span class="font-bold text-zinc-300">Global Ambassador</span>
                  <span class="text-accent font-black">1,000 Points Required (Get +30% rebate)</span>
                </div>
                <p class="text-[9px] text-zinc-500 italic mt-2">Points accumulate through group orders with no demotions and no time limit.</p>
              </div>
            </div>

            <div v-else class="text-[10px] text-zinc-400 leading-relaxed font-light">
              This earning stream multiplies your passive income through long-term network duplication and team-wide reorders.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-vue-next';
import { getFullMediaUrl } from '../../api';
import BinaryTree from './BinaryTree.vue';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const videoStore = useVideoPlayerStore();

const openVideo = (stream) => {
  videoStore.open({
    src: stream.media.filePath,
    title: stream.title,
  });
};

const props = defineProps({
  settings: { type: Object, required: true },
  earningStreams: { type: Array, default: () => [] },
  packages: { type: Array, default: () => [] },
  currencySymbol: { type: String, default: '₦' },
  selectedCountryCode: { type: String, default: 'NG' },
  mediaPreview: { type: Function, required: true },
  getPriceForCountry: { type: Function, required: true },
  formatNumber: { type: Function, required: true },
});

// Zoom
const zoom = ref(1);
const isFullscreen = ref(false);
const zoomIn = () => { if (zoom.value < 3) zoom.value = Number((zoom.value + 0.25).toFixed(2)); };
const zoomOut = () => { if (zoom.value > 0.5) zoom.value = Number((zoom.value - 0.25).toFixed(2)); };
const resetZoom = () => { zoom.value = 1; };
const toggleFullscreen = () => { isFullscreen.value = !isFullscreen.value; zoom.value = 1; };

// Stream focus
const focusedStreamId = ref(null);
const toggleStream = (id) => { focusedStreamId.value = focusedStreamId.value === id ? null : id; };

// Simulators
const drbPkgId = ref(props.packages[0]?.id ?? null);
const msbPkgId = ref(props.packages[0]?.id ?? null);

const simulatedDRB = computed(() => {
  const pkg = props.packages.find(p => p.id === drbPkgId.value) || props.packages[0];
  if (!pkg) return 0;
  const priceObj = pkg.prices?.find(p => p.countryCode === props.selectedCountryCode);
  return priceObj ? priceObj.referralBonus : (pkg.referralBonus || 0);
});

const simulatedMSB = computed(() => {
  const pkg = props.packages.find(p => p.id === msbPkgId.value) || props.packages[0];
  if (!pkg) return 0;
  const priceObj = pkg.prices?.find(p => p.countryCode === props.selectedCountryCode);
  return priceObj ? priceObj.matchBonus : (pkg.matchBonus || 0);
});
</script>
