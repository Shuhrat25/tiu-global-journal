<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCategories } from '@/api'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CategoryCard from './CategoryCard.vue'

const { t, locale } = useI18n()

// приходят с API: title, content (описание), posts (сколько статей), files (иконка)
const categories = ref([])

async function loadCategories() {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('Не удалось загрузить направления', error)
  }
}

onMounted(loadCategories)
watch(locale, loadCategories) // названия на другом языке
</script>

<template>
  <section class="section" aria-labelledby="categories-title">
    <div class="container">
      <SectionHeader id="categories-title" :title="t('categories.title')" :subtitle="t('categories.subtitle')" />

      <ul class="categories">
        <li v-for="category in categories" :key="category.id">
          <CategoryCard :category="category" />
        </li>
      </ul>

      <div class="section__actions">
        <BaseButton to="/categories">{{ t('categories.all') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
