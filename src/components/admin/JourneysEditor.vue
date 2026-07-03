<template>
  <div class="space-y-4">
    <!-- List of Journeys -->
    <div class="space-y-2">
      <div
        v-for="(j, idx) in list"
        :key="j.id || idx"
        class="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition"
      >
        <div class="flex items-center gap-3 min-w-0">
          <!-- Thumbnail / Icon -->
          <div class="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-white flex items-center justify-center shrink-0">
            <img
              v-if="j.image"
              :src="getFullMediaUrl(j.image)"
              alt="Journey Image"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xl">{{ j.icon || '🌱' }}</span>
          </div>
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-zinc-900 truncate">{{ j.title || 'Untitled Journey' }}</h5>
            <p class="text-[10px] text-zinc-500 truncate max-w-md">{{ j.desc || 'No description' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Move Up/Down Buttons -->
          <button
            type="button"
            :disabled="idx === 0"
            @click="move(idx, -1)"
            class="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 transition"
            title="Move Up"
          >
            ▲
          </button>
          <button
            type="button"
            :disabled="idx === list.length - 1"
            @click="move(idx, 1)"
            class="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 transition"
            title="Move Down"
          >
            ▼
          </button>
          
          <button
            type="button"
            @click="openEditModal(j, idx)"
            class="text-[#008A20] hover:text-[#006616] font-bold text-[10px] px-2 py-1 transition"
          >
            Edit
          </button>
          <button
            type="button"
            @click="remove(idx)"
            class="text-red-500 hover:text-red-700 font-bold text-[10px] px-2 py-1 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div v-if="list.length === 0" class="text-center p-6 border border-dashed border-zinc-200 rounded-xl text-zinc-400 text-xs">
        No journey cards defined yet. Click below to add one.
      </div>
    </div>

    <button
      type="button"
      @click="openAddModal"
      class="w-full py-2 border border-dashed border-[#008A20]/40 rounded-xl text-[#008A20] hover:bg-[#008A20]/5 text-xs font-bold transition flex items-center justify-center gap-1"
    >
      + Add Journey Card
    </button>

    <!-- Editor Modal -->
    <UiModal
      v-model="modalOpen"
      :title="editingIndex !== null ? 'Edit Journey Card' : 'Add Journey Card'"
      subtitle="Landing page configuration"
      size="md"
    >
      <form id="journey-form" @submit.prevent="saveCard" class="space-y-4 text-xs">
        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-2 space-y-1">
            <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Title</label>
            <input
              v-model="editingCard.title"
              required
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-2.5 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none"
              placeholder="E.g., New to Network Marketing"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Icon / Emoji</label>
            <input
              v-model="editingCard.icon"
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-2.5 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none text-center"
              placeholder="🌱"
              maxLength="4"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">ID (slug)</label>
            <input
              v-model="editingCard.id"
              required
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-2.5 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none font-mono"
              placeholder="new-to-nm"
              @input="editingCard.id = editingCard.id.toLowerCase().replace(/[^a-z0-9-_]+/g, '-')"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">CTA Button Label</label>
            <input
              v-model="editingCard.ctaLabel"
              required
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-2.5 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none"
              placeholder="E.g., Onboarding"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Description</label>
          <textarea
            v-model="editingCard.desc"
            required
            rows="3"
            class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-2.5 text-xs text-[#0A0F0D] focus:border-[#008A20] focus:outline-none"
            placeholder="Learn the fundamentals of duplication, binary systems..."
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Featured Image (Overrides Icon)</label>
          <MediaPicker
            v-model="editingCard.image"
            assetType="image"
            :is-url-mode="true"
            label=""
            class="mt-1"
          />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn-cancel" @click="modalOpen = false">Cancel</button>
        <button type="submit" form="journey-form" class="btn-save">
          {{ editingIndex !== null ? 'Save Changes' : 'Add Card' }}
        </button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getFullMediaUrl } from '../../api';
import UiModal from '../ui/UiModal.vue';
import MediaPicker from './MediaPicker.vue';
import { useAlertStore } from '../../stores/alert';

const props = defineProps({
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

const alertStore = useAlertStore();
const list = ref([]);
const modalOpen = ref(false);
const editingIndex = ref(null);

// Canonical default journey slugs — pre-populated so admin sees them immediately.
// Title/desc/image are intentionally blank so the admin fills them in.
const DEFAULT_JOURNEYS = [
  { id: 'new-to-nm',            icon: '🌱', title: 'New to Network Marketing',        desc: '', ctaLabel: 'Onboarding',     image: '' },
  { id: 'already-in-nm',        icon: '📈', title: 'Already in Network Marketing',    desc: '', ctaLabel: 'Assessment',     image: '' },
  { id: 'switch-companies',     icon: '🔄', title: 'Want to Switch Companies',        desc: '', ctaLabel: 'Evaluation',     image: '' },
  { id: 'exploring',            icon: '🔍', title: 'Just Exploring Opportunities',    desc: '', ctaLabel: 'Qualifications', image: '' },
  { id: 'income-diversification', icon: '💰', title: 'Tired of Depending on Single Income', desc: '', ctaLabel: 'Benefits', image: '' },
  { id: 'jobless',              icon: '🎯', title: 'Tired of Being Jobless',          desc: '', ctaLabel: 'Hope Flow',     image: '' },
  { id: 'fast-track',           icon: '🔥', title: 'I Want This Business By All Means', desc: '', ctaLabel: 'Fast Track', image: '' },
];

const defaultCard = () => ({
  id: '',
  icon: '🌱',
  title: '',
  desc: '',
  ctaLabel: 'Continue',
  image: ''
});

const editingCard = ref(defaultCard());

// Parse incoming value. Fall back to DEFAULT_JOURNEYS when the setting is
// empty / has never been saved — this ensures admin always sees something.
// We track `initialized` to avoid loadForm()'s empty-string re-assignment
// from wiping out a list that was already populated by the user or defaults.
let initialized = false;

watch(() => props.modelValue, (newVal) => {
  const raw = (newVal || '').trim();

  // Case 1: empty value
  if (!raw || raw === '[]') {
    // If we've already shown data (user edited or defaults were loaded),
    // don't reset the list when the parent form temporarily re-sends ''
    if (initialized && list.value.length > 0) return;

    // First time / genuinely empty — show defaults
    list.value = DEFAULT_JOURNEYS.map(j => ({ ...j }));
    initialized = true;
    // Emit so the parent form is immediately aware of the defaults
    emit('update:modelValue', JSON.stringify(list.value));
    return;
  }

  // Case 2: valid value from DB or prior emission
  try {
    const parsed = JSON.parse(raw);
    list.value = Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_JOURNEYS.map(j => ({ ...j }));
  } catch {
    // Malformed value — fall back to defaults but keep existing if already set
    if (!initialized || list.value.length === 0) {
      list.value = DEFAULT_JOURNEYS.map(j => ({ ...j }));
    }
  }
  initialized = true;
}, { immediate: true });


// Emit updates — only triggered by user actions, not by the watcher loop
const updateParent = () => {
  emit('update:modelValue', JSON.stringify(list.value));
};

const openAddModal = () => {
  editingIndex.value = null;
  editingCard.value = defaultCard();
  modalOpen.value = true;
};

const openEditModal = (card, idx) => {
  editingIndex.value = idx;
  editingCard.value = {
    id: card.id || '',
    icon: card.icon || '🌱',
    title: card.title || '',
    desc: card.desc || '',
    ctaLabel: card.ctaLabel || 'Continue',
    image: card.image || ''
  };
  modalOpen.value = true;
};

const saveCard = () => {
  // Generate ID from title if left blank
  if (!editingCard.value.id.trim()) {
    editingCard.value.id = editingCard.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (editingIndex.value !== null) {
    list.value[editingIndex.value] = { ...editingCard.value };
  } else {
    list.value.push({ ...editingCard.value });
  }

  updateParent();
  modalOpen.value = false;
};

const remove = async (idx) => {
  const ok = await alertStore.showConfirm(
    `Remove the "${list.value[idx].title || list.value[idx].id}" journey card?`,
    'Remove Journey Card',
    'Delete',
    'Cancel'
  );
  if (!ok) return;
  list.value.splice(idx, 1);
  updateParent();
};

const move = (idx, direction) => {
  const nextIdx = idx + direction;
  if (nextIdx < 0 || nextIdx >= list.value.length) return;
  const temp = list.value[idx];
  list.value[idx] = list.value[nextIdx];
  list.value[nextIdx] = temp;
  updateParent();
};
</script>

<style scoped>
.btn-cancel {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  background: transparent;
  border: 1px solid #e4e4e7;
  cursor: pointer;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  transition: color 0.15s, border-color 0.15s;
}
.btn-cancel:hover {
  color: #0A0F0D;
  border-color: #a1a1aa;
}
.btn-save {
  font-size: 0.75rem;
  font-weight: 800;
  background: #008A20;
  color: #fff;
  padding: 0.55rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: filter 0.15s;
}
.btn-save:hover {
  filter: brightness(1.1);
}
</style>
