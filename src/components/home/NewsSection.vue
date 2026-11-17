<script setup>
import { useI18n } from 'vue-i18n'
import { news } from '@/data/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import NewsCard from './NewsCard.vue'

const { t } = useI18n()
</script>

<template>
  <section class="section" aria-labelledby="news-title">
    <div class="container">
      <SectionHeader id="news-title" :title="t('news.title')" :subtitle="t('news.subtitle')" />

      <ul class="news">
        <li v-for="item in news" :key="item.id" class="news__item">
          <NewsCard :item="item" />
        </li>
      </ul>

      <div class="section__actions">
        <BaseButton href="#">{{ t('news.all') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;
}

/* Below desktop the cards become a swipeable row */
@media (max-width: 1279.98px) {
  .news {
    display: flex;
    gap: 16px;
    margin-inline: calc(var(--gutter) * -1);
    padding: 4px var(--gutter) 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .news::-webkit-scrollbar {
    display: none;
  }

  .news__item {
    flex: 0 0 281px;
    scroll-snap-align: start;
  }

  .section__actions {
    margin-top: 8px;
  }
}

@media (max-width: 479.98px) {
  .news__item {
    flex-basis: 78%;
  }
}
</style>
