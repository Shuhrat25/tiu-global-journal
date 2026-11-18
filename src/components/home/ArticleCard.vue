<script setup>
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/i18n/dates'
import { toIsoDate } from '@/api/home'
import BaseButton from '@/components/ui/BaseButton.vue'
import authorIcon from '@/assets/icons/author.svg'
import calendarIcon from '@/assets/icons/calendar-sm.svg'
import eyeIcon from '@/assets/icons/eye-sm.svg'
import downloadIcon from '@/assets/icons/download-sm.svg'

// article — статья из API: title, content, authors, category, page ("36-41"),
// views, download (сколько скачали), files (PDF), created_at
const props = defineProps({
  article: { type: Object, required: true },
})

const { t, locale } = useI18n()

const pages = props.article.page.split('-') // "36-41" → ["36", "41"]
const authors = props.article.authors.map((author) => author.title).join(', ')
const excerpt = props.article.content.replace(/<[^>]*>/g, '') // описание приходит с HTML-тегами
const date = toIsoDate(props.article.created_at)
</script>

<template>
  <article class="article">
    <div class="article__head">
      <span class="article__badge">{{ article.category.title }}</span>
      <span class="article__pages">{{ t('articles.pages', { from: pages[0], to: pages[1] }) }}</span>
    </div>

    <h3 class="article__title">
      <a :href="article.files" target="_blank" rel="noopener noreferrer">{{ article.title }}</a>
    </h3>
    <!-- в API у статей нет DOI, поэтому строка показывается, только если он есть -->
    <a v-if="article.doi" class="article__doi" :href="article.doi" target="_blank" rel="noopener noreferrer">
      DOI: {{ article.doi }}
    </a>
    <p class="article__excerpt">{{ excerpt }}</p>

    <p class="article__authors">
      <img :src="authorIcon" alt="" width="16" height="16" />
      {{ authors }}
    </p>

    <footer class="article__footer">
      <ul class="article__stats">
        <li>
          <img :src="calendarIcon" alt="" width="16" height="16" />
          <time :datetime="date">{{ formatDate(date, locale) }}</time>
        </li>
        <li :title="t('articles.views', { n: article.views })">
          <img :src="eyeIcon" alt="" width="16" height="16" />
          <span aria-hidden="true">{{ article.views }}</span>
          <span class="visually-hidden">{{ t('articles.views', { n: article.views }) }}</span>
        </li>
        <li :title="t('articles.downloads', { n: article.download })">
          <img :src="downloadIcon" alt="" width="16" height="16" />
          <span aria-hidden="true">{{ article.download }}</span>
          <span class="visually-hidden">{{ t('articles.downloads', { n: article.download }) }}</span>
        </li>
      </ul>
      <div class="article__actions">
        <BaseButton size="sm" :href="article.files" target="_blank" rel="noopener noreferrer">
          {{ t('articles.read') }}
        </BaseButton>
        <BaseButton size="sm" variant="outline" :href="article.files" download>{{ t('articles.download') }}</BaseButton>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.article {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 24px 0;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition);
}

.article:hover {
  box-shadow: 0 14px 28px rgb(16 24 40 / 0.12);
}

.article__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.article__badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-badge-bg);
  color: var(--color-badge-text);
  font-size: 14px;
  line-height: 20px;
}

.article__pages {
  margin-top: -2px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.article__title {
  margin-top: 12px;
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  color: var(--color-heading);
}

.article__title a {
  transition: color var(--transition);
}

.article__title a:hover {
  color: var(--color-primary);
}

.article__doi {
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-primary);
  overflow-wrap: anywhere;
}

.article__doi:hover {
  text-decoration: underline;
}

.article__excerpt {
  display: -webkit-box;
  margin-top: 12px;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text);
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article__authors {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 23px; /* footer itself is pushed down with margin-top: auto */
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text);
}

.article__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px 24px;
  margin-top: auto;
  padding-block: 25px;
  border-top: 1px solid var(--color-border);
}

.article__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text-muted);
}

.article__stats li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.article__actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 559.98px) {
  .article {
    padding: 20px 16px 0;
  }

  .article__title {
    font-size: 18px;
    line-height: 26px;
  }

  .article__footer {
    padding-block: 16px;
  }

  .article__actions {
    width: 100%;
  }

  .article__actions > * {
    flex: 1;
  }
}
</style>
