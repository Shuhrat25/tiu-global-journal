<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import CategoryCard from '@/components/home/CategoryCard.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { getCategoriesPage } from '@/api'

const { t, locale } = useI18n()

const categories = ref([])
const total = ref(0) // сколько всего направлений
const page = ref(1)
const loading = ref(true)

async function loadCategories() {
  loading.value = true
  try {
    const json = await getCategoriesPage(page.value)
    categories.value = json.data
    total.value = json.total
  } catch (error) {
    console.error('Не удалось загрузить направления', error)
  }
  loading.value = false
}

function changePage(newPage) {
  page.value = newPage
  loadCategories()
  window.scrollTo({ top: 0 })
}

onMounted(loadCategories)
watch(locale, loadCategories)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.categories')" :crumbs="[{ label: t('pages.categories') }]" />

    <div class="container page-content">
      <p v-if="loading" class="message">{{ t('pages.loading') }}</p>

      <ul v-else class="categories">
        <li v-for="category in categories" :key="category.id">
          <CategoryCard :category="category" />
        </li>
      </ul>

      <AppPagination :page="page" :total="total" :per-page="12" @change="changePage" />
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

.categories {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1279.98px) {
  .categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 559.98px) {
  .categories {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
