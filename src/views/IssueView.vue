<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ArticleCard from '@/components/home/ArticleCard.vue'
import { getIssue, getIssuePosts } from '@/api'

const { t, locale } = useI18n()
const route = useRoute()

const issue = ref(null) // номер журнала: title, content, cover, files (PDF)
const articles = ref([]) // статьи этого номера
const pdfUrl = ref('')
const loading = ref(true)

async function loadIssue() {
  loading.value = true
  try {
    issue.value = await getIssue(route.params.alias)

    // ищем PDF всего номера среди файлов (поля type здесь нет, поэтому смотрим на расширение)
    pdfUrl.value = ''
    for (const file of issue.value.files) {
      if (file.img.endsWith('.pdf')) pdfUrl.value = file.img
    }

    articles.value = await getIssuePosts(issue.value.id)
  } catch (error) {
    console.error('Не удалось загрузить номер журнала', error)
  }
  loading.value = false
}

onMounted(loadIssue)
watch(() => route.params.alias, loadIssue)
watch(locale, loadIssue)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.issues')" :crumbs="[{ label: t('pages.issues'), to: '/issues' }, { label: issue ? issue.title : '' }]" />

    <div class="container page-content">
      <p v-if="loading" class="issue-card">{{ t('pages.loading') }}</p>

      <template v-else-if="issue">
        <section class="issue-card">
          <img class="issue-card__cover" :src="issue.cover" :alt="issue.title" />
          <div class="issue-card__info">
            <h1 class="issue-card__title">{{ issue.title }}</h1>
            <div class="rich-text" v-html="issue.content"></div>
            <!-- PDF лежит на другом сайте, поэтому браузер открывает его в новой вкладке,
                 а там его можно сохранить -->
            <BaseButton v-if="pdfUrl" :href="pdfUrl" target="_blank" rel="noopener noreferrer">
              {{ t('pages.downloadIssue') }}
            </BaseButton>
          </div>
        </section>

        <h2 class="articles-title">{{ t('pages.issueArticles') }}</h2>
        <ul class="articles">
          <li v-for="article in articles" :key="article.id">
            <ArticleCard :article="article" />
          </li>
        </ul>
      </template>
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

.issue-card {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  align-items: start;
  gap: 30px;
  padding: 24px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.issue-card__cover {
  width: 100%;
  border-radius: var(--radius-md);
}

.issue-card__info {
  display: grid;
  justify-items: start;
  gap: 16px;
}

.issue-card__title {
  font-size: clamp(22px, 1.2vw + 14px, 30px);
  line-height: 1.3;
  font-weight: 600;
  color: var(--color-heading);
}

.articles-title {
  margin: 40px 0 20px;
  font-size: 28px;
  font-weight: 500;
  color: var(--color-heading);
}

.articles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1023.98px) {
  .articles {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .issue-card {
    grid-template-columns: 1fr;
  }

  .issue-card__cover {
    max-width: 280px;
  }
}
</style>
