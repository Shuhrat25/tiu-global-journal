<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  /** primary | secondary (white + border) | outline (transparent + primary border) */
  variant: { type: String, default: 'primary' },
  /** md — 50px (section CTAs), sm — 38px (cards) */
  size: { type: String, default: 'md' },
  href: { type: String, default: null },
  /** internal route — renders a RouterLink */
  to: { type: [String, Object], default: null },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
})

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

// Only what the rendered element needs: an `href: undefined` would fall through to RouterLink's <a>
// and replace the href it generates (the link would lose its keyboard focus and its link role)
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot name="icon" />
    <span><slot /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.btn:active {
  transform: translateY(1px);
}

.btn--md {
  min-height: 50px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 18px;
  line-height: 1.4;
}

.btn--sm {
  min-height: 38px;
  padding: 8px 16px;
  border-radius: var(--radius-xs);
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 6px 16px rgb(56 97 167 / 0.25);
}

.btn--secondary {
  background: var(--color-white);
  border-color: var(--color-border);
  color: var(--color-primary);
}

.btn--secondary:hover {
  border-color: var(--color-primary);
}

.btn--outline {
  background: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--block {
  display: flex;
  width: 100%;
}

@media (max-width: 479.98px) {
  .btn--md {
    font-size: 16px;
    min-height: 46px;
  }
}
</style>
