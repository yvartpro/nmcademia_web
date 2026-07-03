<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="modelValue"
        class="nma-confirm-backdrop"
        @mousedown.self="cancel"
        role="alertdialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="nma-confirm-panel">
          <!-- Icon -->
          <div class="nma-confirm-icon" :class="variantIconClass">
            <svg v-if="variant === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else-if="variant === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <svg v-else-if="variant === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4"/><path d="M12 16h.01"/>
            </svg>
          </div>

          <!-- Text -->
          <h3 class="nma-confirm-title">{{ title }}</h3>
          <p class="nma-confirm-message">{{ message }}</p>

          <!-- Actions -->
          <div class="nma-confirm-actions">
            <button v-if="showCancel" type="button" class="nma-confirm-cancel" @click="cancel">
              {{ cancelLabel }}
            </button>
            <button type="button" class="nma-confirm-ok" :class="variantOkClass" @click="confirm">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  modelValue:   { type: Boolean, required: true },
  title:        { type: String, default: 'Are you sure?' },
  message:      { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel:  { type: String, default: 'Cancel' },
  variant:      { type: String, default: 'danger' }, // danger | warning | info | success
  showCancel:   { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const variantIconClass = computed(() => ({
  danger:  'nma-confirm-icon--danger',
  warning: 'nma-confirm-icon--warning',
  info:    'nma-confirm-icon--info',
  success: 'nma-confirm-icon--success',
}[props.variant]));

const variantOkClass = computed(() => ({
  danger:  'nma-confirm-ok--danger',
  warning: 'nma-confirm-ok--warning',
  info:    'nma-confirm-ok--info',
  success: 'nma-confirm-ok--success',
}[props.variant]));

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
}, { immediate: true });
</script>

<style scoped>
.nma-confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9500;
  background: rgba(10, 15, 13, 0.35);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.nma-confirm-panel {
  width: 100%;
  max-width: 22rem;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 20px 60px rgba(10,15,13,0.14), 0 4px 16px rgba(10,15,13,0.06);
  gap: 0.75rem;
}

.nma-confirm-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}
.nma-confirm-icon--danger  { background: rgba(239,68,68,0.1);  color: #ef4444; }
.nma-confirm-icon--warning { background: rgba(245,158,11,0.1); color: #f59e0b; }
.nma-confirm-icon--info    { background: rgba(99,102,241,0.1); color: #6366f1; }
.nma-confirm-icon--success { background: rgba(0,138,32,0.1);    color: #008a20; }

.nma-confirm-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0A0F0D;
  line-height: 1.3;
}

.nma-confirm-message {
  font-size: 0.8rem;
  color: #71717a;
  line-height: 1.6;
}

.nma-confirm-actions {
  display: flex;
  gap: 0.625rem;
  width: 100%;
  margin-top: 0.5rem;
}

.nma-confirm-cancel {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #e4e4e7;
  background: #F4F6F5;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.nma-confirm-cancel:hover { background: #e4e4e7; color: #0A0F0D; border-color: #a1a1aa; }

.nma-confirm-ok {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: filter 0.15s, opacity 0.15s;
}
.nma-confirm-ok:hover { filter: brightness(1.1); }

.nma-confirm-ok--danger  { background: #ef4444; color: #fff; }
.nma-confirm-ok--warning { background: #f59e0b; color: #1f2937; }
.nma-confirm-ok--info    { background: #6366f1; color: #fff; }
.nma-confirm-ok--success { background: #008a20; color: #fff; }

/* Transition */
.confirm-enter-active,
.confirm-leave-active { transition: opacity 0.18s ease; }
.confirm-enter-active .nma-confirm-panel,
.confirm-leave-active .nma-confirm-panel {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s;
}
.confirm-enter-from,
.confirm-leave-to { opacity: 0; }
.confirm-enter-from .nma-confirm-panel,
.confirm-leave-to .nma-confirm-panel {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
</style>
