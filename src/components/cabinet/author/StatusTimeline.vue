<script setup>
/* Status history of an article, oldest first; the last entry is the current status */
import { useI18n } from 'vue-i18n'
import DateText from './DateText.vue'

defineProps({
  /** article.history: [{ status, date }] */
  history: { type: Array, required: true },
})

const { t } = useI18n()
</script>

<template>
  <ol class="timeline">
    <li
      v-for="(entry, index) in history"
      :key="`${index}-${entry.status}`"
      class="timeline__item"
      :class="{ 'is-current': index === history.length - 1 }"
    >
      <span class="timeline__dot" aria-hidden="true" />
      <span class="timeline__status">{{ t(`cabinet.common.status.${entry.status}`) }}</span>
      <DateText class="timeline__date" :date="entry.date" />
    </li>
  </ol>
</template>

<style scoped>
.timeline__item {
  position: relative;
  display: grid;
  gap: 2px;
  padding: 0 0 20px 28px;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

/* line to the next entry's dot */
.timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 19px;
  bottom: -3px;
  left: 5px;
  width: 2px;
  border-radius: 2px;
  background: var(--cab-border);
}

.timeline__dot {
  position: absolute;
  top: 5px;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--cab-border-strong);
}

.is-current .timeline__dot {
  background: var(--color-primary);
  box-shadow: 0 0 0 4px rgb(56 97 167 / 0.15);
}

.timeline__status {
  font-size: 14px;
  line-height: 22px;
  color: var(--cab-text-2);
}

.is-current .timeline__status {
  font-weight: 600;
  color: var(--cab-text);
}

.timeline__date {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}
</style>
