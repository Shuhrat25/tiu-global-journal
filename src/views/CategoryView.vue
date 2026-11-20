<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import ArticleCard from '@/components/home/ArticleCard.vue'
import { getCategory, getCategoryPosts } from '@/api'

const { t } = useI18n()
const route = useRoute()

const category = ref(null) // направление с API: title, content (описание), files (иконка)
const articles = ref([]) // статьи этого направления
const loading = ref(true)

async function loadCategory() {
  loading.value = true
  try {
    category.value = await getCategory(route.params.alias)
    articles.value = await getCategoryPosts(category.value.title)
  } catch (error) {
    console.error('Не удалось загрузить направление', error)
  }
  loading.value = false
}

onMounted(loadCategory)
watch(() => route.params.alias, loadCategory)
</script>

<template>
  <div class="inner-page">
    <PageBanner
      :title="t('pages.categories')"
      :crumbs="[{ label: t('pages.categories'), to: '/categories' }, { label: category ? category.title : '' }]"
    />

    <div class="container page-content">
      <p v-if="loading" class="category-card">{{ t('pages.loading') }}</p>

      <template v-else-if="category">
        <section class="category-card">
          <span class="category-card__icon">
            <img v-if="category.files.length" :src="category.files[0].img" alt="" width="32" height="32" />
          </span>
          <div>
            <h1 class="category-card__title">{{ category.title }}</h1>
            <p class="category-card__desc">{{ category.content }}</p>
          </div>
        </section>

        <p v-if="articles.length === 0" class="message">{{ t('pages.noArticles') }}</p>

        <ul v-else class="articles">
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

.category-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.category-card__icon {
  display: grid;
  flex: 0 0 64px;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
}

.category-card__title {
  font-size: clamp(22px, 1.2vw + 14px, 30px);
  line-height: 1.3;
  font-weight: 600;
  color: var(--color-heading);
}

.category-card__desc {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-text);
}

.message {
  margin-top: 24px;
  padding: 20px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.articles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1023.98px) {
  .articles {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 559.98px) {
  .category-card {
    align-items: flex-start;
    padding: 16px;
  }
}
</style>
