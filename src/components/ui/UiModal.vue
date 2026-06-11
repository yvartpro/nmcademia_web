<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="nma-modal-backdrop"
        @mousedown.self="$emit('update:modelValue', false)"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="nma-modal-panel" :class="sizeClass" @keydown.esc="$emit('update:modelValue', false)">
          <!-- Header -->
          <div class="nma-modal-header">
            <div>
              <p v-if="subtitle" class="nma-modal-subtitle">{{ subtitle }}</p>
              <h3 class="nma-modal-title">{{ title }}</h3>
            </div>
            <button
              type="button"
              class="nma-modal-close"
              @click="$emit('update:modelValue', false)"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="nma-modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="nma-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg | xl
});

defineEmits(['update:modelValue']);

const sizeClass = {
  sm: 'nma-modal--sm',
  md: 'nma-modal--md',
  lg: 'nma-modal--lg',
  xl: 'nma-modal--xl',
}[props.size] ?? 'nma-modal--md';

// Lock body scroll while modal is open
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
}, { immediate: true });
</script>

<style scoped>
.nma-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(10, 15, 13, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.nma-modal-panel {
  position: relative;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 1.25rem;
  box-shadow: 0 20px 60px rgba(10,15,13,0.12), 0 4px 16px rgba(10,15,13,0.06);
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 2rem);
  my: 1rem;
}

.nma-modal--sm  { max-width: 26rem; }
.nma-modal--md  { max-width: 36rem; }
.nma-modal--lg  { max-width: 48rem; }
.nma-modal--xl  { max-width: 62rem; }

.nma-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid #f4f4f5;
  flex-shrink: 0;
}

.nma-modal-subtitle {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #008A20;
  margin-bottom: 0.15rem;
}

.nma-modal-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0A0F0D;
  line-height: 1.2;
}

.nma-modal-close {
  flex-shrink: 0;
  margin-top: 0.1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nma-modal-close:hover {
  background: #f4f4f5;
  color: #0A0F0D;
}

.nma-modal-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
  scroll-behavior: smooth;
}

.nma-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f4f4f5;
  flex-shrink: 0;
  background: #F4F6F5;
  border-radius: 0 0 1.25rem 1.25rem;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .nma-modal-panel,
.modal-leave-active .nma-modal-panel {
  transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .nma-modal-panel,
.modal-leave-to .nma-modal-panel {
  transform: translateY(18px) scale(0.97);
  opacity: 0;
}
</style>
