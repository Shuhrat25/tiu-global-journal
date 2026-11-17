<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

/*
 * Wizard steps: numbered circles joined by lines; done steps get a check mark.
 * A label that does not fit wraps instead of running into the next step. On phones only the
 * current step shows its label (the others stay readable for screen readers): the other steps
 * shrink to their circle, and the current one takes the rest of the row.
 */
defineProps({
  steps: { type: Array, required: true }, // labels
  current: { type: Number, required: true }, // 0-based
})
</script>

<template>
  <ol class="stepper">
    <li
      v-for="(label, index) in steps"
      :key="label"
      class="stepper__step"
      :class="{ 'is-done': index < current, 'is-current': index === current }"
      :aria-current="index === current ? 'step' : undefined"
    >
      <span class="stepper__circle">
        <AppIcon v-if="index < current" name="check" :size="18" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="stepper__label">{{ label }}</span>
    </li>
  </ol>
</template>

<style scoped>
.stepper {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.stepper__step {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
}

.stepper__step:not(:last-child)::after {
  content: '';
  flex: 1;
  height: 2px;
  min-width: 16px;
  border-radius: 2px;
  background: var(--cab-border);
}

.stepper__step.is-done:not(:last-child)::after {
  background: var(--color-primary);
}

.stepper__circle {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--tone-gray-bg);
  font-size: 16px;
  font-weight: 600;
  color: var(--cab-muted);
}

.stepper__step.is-current {
  color: var(--cab-text);
  font-weight: 500;
}

.stepper__step.is-current .stepper__circle,
.stepper__step.is-done .stepper__circle {
  background: var(--color-primary);
  color: var(--color-white);
}

/* one line while there is room; in a narrow row the label wraps (a very long word breaks) */
.stepper__label {
  overflow-wrap: anywhere;
  text-wrap: balance;
}

@media (max-width: 767.98px) {
  .stepper {
    gap: 8px;
    margin-bottom: 20px;
  }

  .stepper__step {
    flex: 0 0 auto;
    gap: 8px;
  }

  .stepper__step.is-current {
    flex: 1 1 auto;
  }

  .stepper__step:not(:last-child)::after {
    min-width: 12px;
  }

  .stepper__circle {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  /* only the current step shows its label on phones; the others are read by screen readers only */
  .stepper__step:not(.is-current) .stepper__label {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
