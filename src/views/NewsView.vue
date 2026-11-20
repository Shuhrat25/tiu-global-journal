<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import { getNewsItem, toIsoDate } from '@/api'
import { formatDate } from '@/i18n/dates'
import calendarIcon from '@/assets/icons/calendar.svg'
import eyeIcon from '@/assets/icons/eye.svg'

const { t, locale } = useI18n()
const route = useRoute()

const news = ref(null) // с API: title, content, files (картинки), views, created_at
const loading = ref(true)

async function loadNews() {
  loading.value = true
  try {
    news.value = await getNewsItem(route.params.alias)
  } catch (error) {
    console.error('Не удалось загрузить новость', error)
  }
  loading.value = false
}

onMounted(loadNews)
watch(() => route.params.alias, loadNews)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.news')" :crumbs="[{ label: t('pages.news'), to: '/news' }]" />

    <div class="container page-content">
      <article class="news">
        <p v-if="loading">{{ t('pages.loading') }}</p>

        <template v-else-if="news">
          <h1 class="news__title">{{ news.title }}</h1>

          <div class="news__meta">
            <span class="news__meta-item">
              <img :src="calendarIcon" alt="" width="20" height="20" />
              {{ formatDate(toIsoDate(news.created_at), locale) }}
            </span>
            <span class="news__meta-item">
              <img :src="eyeIcon" alt="" width="20" height="20" />
              {{ news.views }}
            </span>
          </div>

          <!-- у новости может быть несколько картинок -->
          <img v-for="file in news.files" :key="file.img" class="news__image" :src="file.img" :alt="news.title" />

          <div v-if="news.content" class="rich-text" v-html="news.content"></div>
        </template>
      </article>
    </div>
  </div>
</template>

<style scoped>
.inner-page {
  background: var(--color-bg-topbar);
}

.page-content {
  position: relative;
  margin-top: -30px;
  padding-bottom: var(--section-space);
}

.news {
  display: grid;
  gap: 20px;
  padding: 30px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.news__title {
  font-size: clamp(24px, 1.5vw + 14px, 36px);
  line-height: 1.25;
  font-weight: 500;
  color: var(--color-heading);
}

.news__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 18px;
  color: var(--color-text-muted);
}

.news__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.news__image {
  width: 100%;
  max-height: 700px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg-topbar);
}

@media (max-width: 767.98px) {
  .news {
    padding: 16px;
  }
}
</style>
