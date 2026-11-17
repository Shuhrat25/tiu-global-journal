<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

/*
 * Dashboard counter. When `clickable`, the whole card is a toggle button that
 * filters the table below (Figma comment #18); `active` marks the current filter.
 */
defineProps({
  icon: { type: String, required: true },
  /** blue | yellow | green | orange | red | purple | teal | indigo | gray */
  tone: { type: String, default: 'blue' },
  value: { type: [Number, String], required: true },
  label: { type: String, required: true },
  clickable: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    class="stat"
    :class="[`stat--${tone}`, { 'stat--clickable': clickable, 'is-active': active }]"
    :aria-pressed="clickable ? active : undefined"
    @click="clickable && $emit('click')"
  >
    <span class="stat__icon"><AppIcon :name="icon" :size="24" /></span>
    <span class="stat__value">{{ value }}</span>
    <span class="stat__label">{{ label }}</span>
  </component>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 24px;
  background: var(--cab-surface);
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius);
  text-align: left;
  transition:
    border-color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.stat--clickable {
  cursor: pointer;
}

.stat--clickable:hover {
  border-color: var(--cab-border-strong);
  box-shadow: 0 6px 16px rgb(16 24 40 / 0.06);
  transform: translateY(-1px);
}

.stat.is-active {
  border-color: var(--stat-fg);
  box-shadow: 0 0 0 3px var(--stat-bg);
}

.stat__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  border-radius: var(--cab-radius-sm);
  background: var(--stat-bg);
  color: var(--stat-fg);
}

.stat__value {
  font-size: 28px;
  line-height: 34px;
  font-weight: 600;
  color: var(--cab-text);
}

.stat__label {
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-subtle);
}

.stat--blue { --stat-bg: var(--tone-blue-bg); --stat-fg: var(--tone-blue-fg); }
.stat--yellow { --stat-bg: var(--tone-yellow-bg); --stat-fg: var(--tone-yellow-fg); }
.stat--green { --stat-bg: var(--tone-green-bg); --stat-fg: var(--tone-green-fg); }
.stat--orange { --stat-bg: var(--tone-orange-bg); --stat-fg: var(--tone-orange-fg); }
.stat--red { --stat-bg: var(--tone-red-bg); --stat-fg: var(--tone-red-fg); }
.stat--purple { --stat-bg: var(--tone-purple-bg); --stat-fg: var(--tone-purple-fg); }
.stat--teal { --stat-bg: var(--tone-teal-bg); --stat-fg: var(--tone-teal-fg); }
.stat--indigo { --stat-bg: var(--tone-indigo-bg); --stat-fg: var(--tone-indigo-fg); }
.stat--gray { --stat-bg: var(--tone-gray-bg); --stat-fg: var(--tone-gray-fg); }

@media (max-width: 767.98px) {
  .stat {
    padding: 16px;
  }

  .stat__icon {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }

  .stat__value {
    font-size: 24px;
    line-height: 30px;
  }
}
</style>
