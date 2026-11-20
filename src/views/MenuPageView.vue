<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import PageWithSidebar from '@/components/page/PageWithSidebar.vue'
import { getMenuPage } from '@/api'

const { t, locale } = useI18n()
const route = useRoute()

const page = ref(null) // с API: title и content (HTML)
const loading = ref(true)

async function loadPage() {
  loading.value = true
  try {
    page.value = await getMenuPage(route.params.alias)
  } catch (error) {
    console.error('Не удалось загрузить страницу', error)
  }
  loading.value = false
}

onMounted(loadPage)
// если перейти с одной страницы меню на другую, компонент тот же — загружаем заново
watch(() => route.params.alias, loadPage)
watch(locale, loadPage)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="page ? page.title : ''" :crumbs="[{ label: page ? page.title : '' }]" />

    <PageWithSidebar>
      <article class="content-card">
        <p v-if="loading">{{ t('pages.loading') }}</p>
        <div v-else-if="page && page.content" class="rich-text" v-html="page.content"></div>
        <p v-else>{{ t('pages.noContent') }}</p>
      </article>
    </PageWithSidebar>
  </div>
</template>

<style scoped>
.inner-page {
  background: var(--color-bg-topbar);
}

.content-card {
  padding: 20px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  font-size: 18px;
  line-height: 28px;
}
</style>
