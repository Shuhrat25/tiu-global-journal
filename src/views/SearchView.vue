<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { search, toIsoDate } from '@/api'
import { formatDate } from '@/i18n/dates'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const query = ref(route.query.query || '') // текст в поле поиска
const results = ref([])
const total = ref(0)
const loading = ref(false)
const searched = ref(false) // искали ли уже хоть раз

async function loadResults() {
  const text = route.query.query
  if (!text) return

  loading.value = true
  try {
    const json = await search(text)
    results.value = json.data
    total.value = json.total
  } catch (error) {
    console.error('Поиск не сработал', error)
  }
  loading.value = false
  searched.value = true
}

// Текст поиска храним в адресе (/search?query=...), чтобы работала кнопка «Назад»
function onSubmit() {
  if (!query.value.trim()) return
  router.push({ path: '/search', query: { query: query.value.trim() } })
}

// Новости открываются на странице новости, статьи — на странице статьи
function resultLink(item) {
  if (item.group === 'news') return '/news/' + item.alias
  if (item.group === 'posts') return '/articles/' + item.alias
  return '/'
}

onMounted(loadResults)
// поиск из шапки, когда мы уже на этой странице
watch(
  () => route.query.query,
  (newQuery) => {
    query.value = newQuery || ''
    loadResults()
  },
)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.search')" :crumbs="[{ label: t('pages.search') }]" />

    <div class="container page-content">
      <div class="search-card">
        <form class="search-form" role="search" @submit.prevent="onSubmit">
          <input
            v-model="query"
            class="search-form__input"
            type="search"
            :placeholder="t('header.searchPlaceholder')"
            :aria-label="t('header.searchLabel')"
          />
          <BaseButton type="submit">{{ t('header.search') }}</BaseButton>
        </form>

        <p v-if="loading">{{ t('pages.loading') }}</p>

        <template v-else-if="searched">
          <p class="search-card__count">{{ t('pages.results', { n: total }) }}</p>

          <p v-if="results.length === 0">{{ t('pages.notFound') }}</p>

          <ul class="results">
            <li v-for="item in results" :key="item.group + item.id" class="result">
              <RouterLink class="result__link" :to="resultLink(item)">
                <img v-if="item.group === 'news'" class="result__image" :src="item.files" alt="" loading="lazy" />
                <span>
                  <span class="result__type">{{ item.group === 'news' ? t('pages.news') : t('pages.article') }}</span>
                  <span class="result__title">{{ item.title }}</span>
                  <span class="result__date">{{ formatDate(toIsoDate(item.created_at), locale) }}</span>
                </span>
              </RouterLink>
            </li>
          </ul>
        </template>
      </div>
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

.search-card {
  display: grid;
  gap: 20px;
  padding: 24px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.search-form {
  display: flex;
  gap: 12px;
}

.search-form__input {
  flex: 1;
  min-width: 0;
  height: 50px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 16px;
}

.search-card__count {
  color: var(--color-text-muted);
}

.results {
  display: grid;
  gap: 12px;
}

.result__link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition);
}

.result__link:hover {
  border-color: var(--color-primary);
}

.result__image {
  flex: 0 0 120px;
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.result__type {
  display: block;
  font-size: 14px;
  color: var(--color-primary);
}

.result__title {
  display: block;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 500;
  color: var(--color-heading);
}

.result__date {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: var(--color-text-muted);
}

@media (max-width: 559.98px) {
  .search-form {
    flex-direction: column;
  }

  .result__image {
    display: none;
  }
}
</style>
