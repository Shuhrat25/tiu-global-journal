<script setup>
import { useI18n } from 'vue-i18n'
import { articles, latestIssue } from '@/data/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ArticleCard from './ArticleCard.vue'

const { t } = useI18n()
</script>

<template>
  <section class="section--soft" aria-labelledby="articles-title">
    <div class="container">
      <SectionHeader
        id="articles-title"
        :title="t('articles.title')"
        :subtitle="t('articles.subtitle', { number: latestIssue.number, year: latestIssue.year })"
      />

      <ul class="articles">
        <li v-for="article in articles" :key="article.id">
          <ArticleCard :article="article" />
        </li>
      </ul>

      <div class="section__actions">
        <BaseButton href="#">{{ t('articles.all') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.articles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1023.98px) {
  .articles {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
