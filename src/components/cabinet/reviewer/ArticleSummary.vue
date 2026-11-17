<script setup>
/* Article heading inside the review modals: title, authors and the file download */
import { useI18n } from 'vue-i18n'
import ArticleDownloadButton from './ArticleDownloadButton.vue'

defineProps({
  article: { type: Object, required: true },
})

const { t } = useI18n()
</script>

<template>
  <div class="summary">
    <div class="summary__text">
      <h3 class="summary__title">{{ article.title }}</h3>
      <p class="summary__authors">{{ t('cabinet.reviewer.article.authors', { authors: article.authors }) }}</p>
    </div>
    <ArticleDownloadButton :article="article" variant="outline" class="summary__download">
      {{ t('cabinet.reviewer.article.download') }}
    </ArticleDownloadButton>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  padding: 16px 20px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.summary__text {
  display: grid;
  flex: 1 1 320px;
  gap: 4px;
  min-width: 0;
}

.summary__title {
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: var(--cab-text);
}

.summary__authors {
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-subtle);
}

@media (max-width: 767.98px) {
  .summary {
    padding: 14px 16px;
  }

  .summary__title {
    font-size: 16px;
    line-height: 24px;
  }

  .summary__download {
    width: 100%;
  }
}
</style>
