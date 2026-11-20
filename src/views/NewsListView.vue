<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import NewsCard from '@/components/home/NewsCard.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { getNewsPage } from '@/api'

const { t } = useI18n()

const news = ref([])
const total = ref(0) // сколько всего новостей
const page = ref(1)
const loading = ref(true)

async function loadNews() {
  loading.value = true
  try {
    const json = await getNewsPage(page.value)
    news.value = json.data
    total.value = json.total
  } catch (error) {
    console.error('Не удалось загрузить новости', error)
  }
  loading.value = false
}

function changePage(newPage) {
  page.value = newPage
  loadNews()
  window.scrollTo({ top: 0 })
}

onMounted(loadNews)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.news')" :crumbs="[{ label: t('pages.news') }]" />

    <div class="container page-content">
      <p v-if="loading" class="message">{{ t('pages.loading') }}</p>

      <ul v-else class="news-grid">
        <li v-for="item in news" :key="item.id">
          <NewsCard :item="item" />
        </li>
      </ul>

      <AppPagination :page="page" :total="total" :per-page="9" @change="changePage" />
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

.message {
  padding: 20px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1023.98px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 559.98px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
