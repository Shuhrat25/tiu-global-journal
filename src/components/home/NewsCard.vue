<script setup>
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/i18n/dates'
import { toIsoDate } from '@/api/home'
import calendarIcon from '@/assets/icons/calendar.svg'
import eyeIcon from '@/assets/icons/eye.svg'

// item — новость из API: title, files (картинка), views, created_at
defineProps({
  item: { type: Object, required: true },
})

const { t, locale } = useI18n()
</script>

<template>
  <article class="news-card">
    <a class="news-card__link" href="#">
      <div class="news-card__media">
        <img :src="item.files" alt="" loading="lazy" />
      </div>
      <h3 class="news-card__title">{{ item.title }}</h3>
    </a>
    <footer class="news-card__meta">
      <span class="news-card__meta-item">
        <img :src="calendarIcon" alt="" width="20" height="20" />
        <time :datetime="toIsoDate(item.created_at)">{{ formatDate(toIsoDate(item.created_at), locale) }}</time>
      </span>
      <span class="news-card__meta-item" :title="t('news.views', { n: item.views })">
        <img :src="eyeIcon" alt="" width="20" height="20" />
        <span aria-hidden="true">{{ item.views }}</span>
        <span class="visually-hidden">{{ t('news.views', { n: item.views }) }}</span>
      </span>
    </footer>
  </article>
</template>

<style scoped>
.news-card {
  /* containing block of the visually hidden "views" label (otherwise it is positioned against the page) */
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-bg-news);
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgb(16 24 40 / 0.12);
}

.news-card__link {
  flex: 1;
}

.news-card__media {
  aspect-ratio: 281 / 200;
  overflow: hidden;
  background: var(--color-border);
}

.news-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.news-card:hover .news-card__media img {
  transform: scale(1.05);
}

.news-card__title {
  display: -webkit-box;
  margin: 12px 12px 12px;
  overflow: hidden;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -0.01em; /* SF Pro Display tracking — keeps the 3-line titles from the design */
  color: #011024;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: color var(--transition);
}

.news-card__link:hover .news-card__title {
  color: var(--color-primary);
}

.news-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 12px 12px;
  border-top: 1px solid rgb(56 97 167 / 0.15);
  font-size: 16px;
  line-height: 1.3;
  color: var(--color-primary);
}

.news-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
</style>
