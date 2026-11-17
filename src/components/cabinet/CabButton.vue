<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  /** primary | secondary | outline | success | danger | danger-outline | soft */
  variant: { type: String, default: 'primary' },
  /** sm (32px, table actions) | md (42px, modals) | lg (48px, page actions) */
  size: { type: String, default: 'md' },
  icon: { type: String, default: null },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    class="cab-btn"
    :class="[`cab-btn--${variant}`, `cab-btn--${size}`, { 'cab-btn--block': block }]"
    :disabled="disabled"
  >
    <AppIcon v-if="icon" :name="icon" :size="size === 'sm' ? 16 : 20" />
    <span><slot /></span>
  </button>
</template>

<style scoped>
.cab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--cab-radius-sm);
  font-weight: 500;
  white-space: nowrap;
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition),
    opacity var(--transition);
}

.cab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cab-btn--sm {
  min-height: 32px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
}

.cab-btn--md {
  min-height: 42px;
  padding: 8px 20px;
  font-size: 15px;
  line-height: 24px;
}

.cab-btn--lg {
  min-height: 48px;
  padding: 11px 24px;
  font-size: 16px;
  line-height: 24px;
}

.cab-btn--block {
  width: 100%;
}

.cab-btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.cab-btn--primary:not(:disabled):hover {
  background: var(--color-primary-dark);
}

.cab-btn--secondary {
  background: var(--tone-gray-bg);
  color: var(--cab-text-2);
}

.cab-btn--secondary:not(:disabled):hover {
  background: var(--cab-border);
}

.cab-btn--outline {
  background: var(--cab-surface);
  border-color: var(--cab-border-strong);
  color: var(--cab-text-2);
}

.cab-btn--outline:not(:disabled):hover {
  background: var(--cab-bg);
}

.cab-btn--success {
  background: var(--cab-success);
  color: var(--color-white);
}

.cab-btn--success:not(:disabled):hover {
  background: var(--cab-success-hover);
}

.cab-btn--danger {
  background: var(--cab-danger);
  color: var(--color-white);
}

.cab-btn--danger:not(:disabled):hover {
  background: var(--tone-red-fg);
}

.cab-btn--danger-outline {
  background: var(--cab-surface);
  border-color: #ffa2a2;
  color: var(--cab-danger);
}

.cab-btn--danger-outline:not(:disabled):hover {
  background: #fef2f2;
}

.cab-btn--soft {
  background: #eff6ff;
  color: var(--tone-blue-fg);
}

.cab-btn--soft:not(:disabled):hover {
  background: var(--tone-blue-bg);
}
</style>
