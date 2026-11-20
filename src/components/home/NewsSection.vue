<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getNews } from '@/api'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import NewsCard from './NewsCard.vue'

const { t } = useI18n()

const news = ref([]) // приходят с API

onMounted(async () => {
  try {
    news.value = await getNews()
  } catch (error) {
    console.error('Не удалось загрузить новости', error)
  }
})
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
        <BaseButton to="/news">{{ t('news.all') }}</BaseButton>
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

/* На экранах поменьше карточки, которые не помещаются, переносятся на новую строку */
@media (max-width: 1279.98px) {
  .news {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 767.98px) {
  .news {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 479.98px) {
  .news {
    grid-template-columns: 1fr;
  }
}
</style>
