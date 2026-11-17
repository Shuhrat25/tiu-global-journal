<script setup>
/* A date in the current language with its machine-readable value; it never breaks across lines */
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/i18n/dates'

defineProps({
  /** YYYY-MM-DD */
  date: { type: String, required: true },
})

const { locale } = useI18n()
</script>

<template>
  <time class="date-text" :datetime="date">{{ formatDate(date, locale) }}</time>
</template>

<style scoped>
.date-text {
  white-space: nowrap;
}
</style>
