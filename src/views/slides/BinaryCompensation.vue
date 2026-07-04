<template>
  <div class="motion-safe:animate-fade-in space-y-8">
    <h2 class="text-2xl sm:text-3xl font-display font-black">Understanding the Binary Structure</h2>

    <div class="p-5 bg-white border border-zinc-200 rounded-xl space-y-4">
      <p class="text-xs sm:text-sm text-zinc-600 leading-relaxed">
        A <strong>Binary Structure</strong> means you build only two sides: a <strong>Left Team</strong> and a
        <strong>Right Team</strong>. Every time you place a package referral on the Left and another on the Right,
        they pair to generate a <strong>Pairing Match Bonus (MSB)</strong>.
      </p>

      <!-- Binary Tree Video Preview -->
      <div v-if="settings?.['binary_tree_video']" class="rounded-3xl border border-zinc-200 bg-zinc-50 overflow-hidden p-5">
        <div class="flex items-start gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 text-sm font-semibold">▶</span>
          <div class="flex-grow">
            <p class="text-sm font-bold text-zinc-900">How the Binary Structure Really Works</p>
            <p class="text-xs text-zinc-500 mt-1">Watch this short video to understand how the binary structure works and how pairings generate income.</p>
            <button
              type="button"
              @click="openBinaryTreeVideo"
              class="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition mt-3"
            >
              Watch Video
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Country presentation video (only when assigned to selected country) -->
    <div v-if="presentationVideoSrc" class="space-y-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Country Presentation</h3>
      <div
        @click="openPresentationVideo"
        class="aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm relative cursor-pointer group"
      >
        <img
          v-if="presentationPreviewImage"
          :src="presentationPreviewImage"
          :alt="presentation?.title || 'Presentation video'"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div v-else class="absolute inset-0 bg-zinc-100 group-hover:bg-zinc-200 transition duration-500" />
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />
        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
          <p class="text-sm font-bold">{{ presentation?.title || 'Country presentation' }}</p>
          <p v-if="presentation?.description" class="text-[11px] mt-1 text-white/80 line-clamp-2">
            {{ presentation.description }}
          </p>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
            <Play :size="28" class="text-white ml-1" />
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
            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 overflow-hidden">
              <img
                v-if="stream.mediaType === 'image'"
                :src="mediaPreview(stream.media.filePath)"
                :alt="stream.media.alt"
                class="w-full h-[240px] object-cover"
              />

              <div v-else-if="stream.mediaType === 'video'" class="p-4 sm:p-5 space-y-4">
                <div class="flex items-start gap-3">
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 text-sm font-semibold">▶</span>
                  <div>
                    <p class="text-sm font-bold text-zinc-900">Video walkthrough available</p>
                    <p class="text-xs text-zinc-500 mt-1">Open this short explainer video to see the stream in action and learn the payout logic.</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click.stop="openVideo(stream)"
                  class="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-bold text-zinc-900 hover:bg-accent-light transition"
                >
                  Watch the stream video
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <span class="text-2xl">{{ stream.icon || '💰' }}</span>
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <h4 class="font-extrabold text-sm" :class="focusedStreamId === stream.id ? 'text-accent' : 'text-zinc-900'">
                  {{ stream.title }}
                </h4>
                <span class="text-[13px] text-zinc-500 font-semibold">
                  {{ focusedStreamId === stream.id ? 'Hide Details' : 'Show Details' }}
                </span>
              </div>
              <p class="text-[14px] text-zinc-800 leading-relaxed mt-1">{{ stream.shortDescription }}</p>
              <p v-if="stream.longDescription && focusedStreamId === stream.id" class="text-[14px] text-zinc-500 mt-2 border-t border-zinc-200/50 pt-2 font-light">
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
                  <label class="block text-[13px] text-zinc-400 uppercase font-bold mb-1">Select structural package level:</label>
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
              <div class="space-y-2 text-[13px]">
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
                <p class="text-[13px] text-zinc-500 italic mt-2">Points accumulate through group orders with no demotions and no time limit.</p>
              </div>
            </div>

            <div v-else class="text-[13px] text-zinc-400 leading-relaxed font-light">
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
import { Play } from 'lucide-vue-next';
import { getFullMediaUrl } from '../../api';
import { useVideoPlayerStore } from '@/stores/videoPlayer';

const videoStore = useVideoPlayerStore();

const openBinaryTreeVideo = () => {
  if (props.settings?.['binary_tree_video']) {
    videoStore.open({
      src: props.settings['binary_tree_video'],
      title: 'Binary Tree Structure Explainer',
    });
  }
};

const openVideo = (stream) => {
  videoStore.open({
    src: stream.media.filePath,
    title: stream.title,
  });
};

const props = defineProps({
  settings: { type: Object, required: true },
  presentation: { type: Object, default: null },
  earningStreams: { type: Array, default: () => [] },
  packages: { type: Array, default: () => [] },
  currencySymbol: { type: String, default: '₦' },
  selectedCountryCode: { type: String, default: 'NG' },
  mediaPreview: { type: Function, required: true },
  getPriceForCountry: { type: Function, required: true },
  formatNumber: { type: Function, required: true },
});

const presentationVideoSrc = computed(() => {
  if (props.presentation?.media) return getFullMediaUrl(props.presentation.media);
  return '';
});

const presentationPreviewImage = computed(() => {
  if (props.presentation?.media?.thumbnailPath) {
    return getFullMediaUrl(props.presentation.media.thumbnailPath);
  }
  return '';
});

const openPresentationVideo = () => {
  if (!presentationVideoSrc.value) return;
  videoStore.open({
    src: presentationVideoSrc.value,
    title: props.presentation?.title || 'Country Presentation',
    thumbnail: presentationPreviewImage.value || null,
  });
};

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
