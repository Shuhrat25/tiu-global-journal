<script setup>
import { useI18n } from 'vue-i18n'

/* "Мақола: <title>" at the top of the editor dialogs; meta lines (authors, reviewer…) go into the slot */
defineProps({
  title: { type: String, required: true },
})

const { t } = useI18n()
</script>

<template>
  <!-- a div, not <header>: inside a dialog a header would be exposed as a page banner landmark -->
  <div class="article-heading">
    <h3 class="article-heading__title">{{ t('cabinet.editor.article.heading', { title }) }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.article-heading {
  display: grid;
  gap: 8px;
}

.article-heading__title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

:slotted(p) {
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-subtle);
}
</style>
