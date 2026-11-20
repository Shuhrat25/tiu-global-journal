<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { downloadPost, getPost, toIsoDate } from '@/api'
import { formatDate } from '@/i18n/dates'
import authorIcon from '@/assets/icons/author.svg'
import calendarIcon from '@/assets/icons/calendar-sm.svg'
import eyeIcon from '@/assets/icons/eye-sm.svg'
import downloadIcon from '@/assets/icons/download-sm.svg'

const { t, locale } = useI18n()
const route = useRoute()

// статья с API: title, content (аннотация), authors, category, views, download, files (PDF)
const article = ref(null)
const loading = ref(true)
const downloading = ref(false)

async function loadArticle() {
  loading.value = true
  try {
    article.value = await getPost(route.params.alias)
  } catch (error) {
    console.error('Не удалось загрузить статью', error)
  }
  loading.value = false
}

async function download() {
  downloading.value = true
  try {
    // в ответе по одной статье нет download_url, поэтому собираем его сами, как в списке статей
    await downloadPost({
      title: article.value.title,
      download_url: 'https://journal.tiu.uz/api/v1/posts/download?id=' + article.value.id,
    })
    article.value.download++
  } catch (error) {
    console.error(error)
    alert(t('pages.downloadError'))
  }
  downloading.value = false
}

function authorsText() {
  return article.value.authors.map((author) => author.title).join(', ')
}

onMounted(loadArticle)
watch(() => route.params.alias, loadArticle)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.article')" :crumbs="[{ label: t('pages.issues'), to: '/issues' }, { label: t('pages.article') }]" />

    <div class="container page-content">
      <article class="article">
        <p v-if="loading">{{ t('pages.loading') }}</p>

        <template v-else-if="article">
          <span class="article__badge">{{ article.category.title }}</span>
          <h1 class="article__title">{{ article.title }}</h1>

          <p class="article__authors">
            <img :src="authorIcon" alt="" width="18" height="18" />
            {{ authorsText() }}
          </p>

          <ul class="article__stats">
            <li>
              <img :src="calendarIcon" alt="" width="18" height="18" />
              {{ formatDate(toIsoDate(article.created_at), locale) }}
            </li>
            <li :title="t('articles.views', { n: article.views })">
              <img :src="eyeIcon" alt="" width="18" height="18" />
              {{ article.views }}
            </li>
            <li :title="t('articles.downloads', { n: article.download })">
              <img :src="downloadIcon" alt="" width="18" height="18" />
              {{ article.download }}
            </li>
          </ul>

          <div class="rich-text" v-html="article.content"></div>

          <div class="article__actions">
            <BaseButton size="sm" :href="article.files" target="_blank" rel="noopener noreferrer">
              {{ t('articles.read') }}
            </BaseButton>
            <BaseButton size="sm" variant="outline" :disabled="downloading" @click="download">
              {{ t('articles.download') }}
            </BaseButton>
          </div>
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

.article {
  display: grid;
  justify-items: start;
  gap: 16px;
  padding: 30px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.article__badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-badge-bg);
  color: var(--color-badge-text);
  font-size: 14px;
  line-height: 20px;
}

.article__title {
  font-size: clamp(22px, 1.2vw + 14px, 32px);
  line-height: 1.3;
  font-weight: 500;
  color: var(--color-heading);
}

.article__authors,
.article__stats li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text);
}

.article__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.article__actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 767.98px) {
  .article {
    padding: 16px;
  }
}
</style>
