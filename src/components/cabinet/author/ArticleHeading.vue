<script setup>
/* "Мақола: <title>" heading of the author dialogs with the article's current status (Figma "Muharrir izohlari") */
import { useI18n } from 'vue-i18n'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'

defineProps({
  article: { type: Object, required: true },
})

const { t } = useI18n()
</script>

<template>
  <div class="heading">
    <h3 class="heading__title">{{ t('cabinet.author.articleLabel', { title: article.title }) }}</h3>
    <StatusBadge :status="article.status" />
  </div>
</template>

<style scoped>
.heading {
  display: grid;
  justify-items: start;
  gap: 8px;
}

.heading__title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}
</style>
