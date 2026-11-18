<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCategories } from '@/api/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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
          <a class="category" href="#">
            <div class="category__top">
              <span class="category__icon">
                <img :src="category.files[0].img" alt="" width="32" height="32" />
              </span>
              <span class="category__count">{{ t('categories.count', category.posts) }}</span>
            </div>
            <h3 class="category__title">{{ category.title }}</h3>
            <p class="category__desc">{{ category.content }}</p>
          </a>
        </li>
      </ul>

      <div class="section__actions">
        <BaseButton href="#">{{ t('categories.all') }}</BaseButton>
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

.category {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-light);
  color: var(--color-white);
  transition:
    background-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
}

.category:hover {
  background: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgb(56 97 167 / 0.25);
}

.category__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.category__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 0.2);
}

.category__count {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgb(255 255 255 / 0.2);
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
}

.category__title {
  margin-top: 16px;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
}

.category__desc {
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.3;
  color: rgb(255 255 255 / 0.9);
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

  .category__title {
    font-size: 18px;
  }

  .category__desc {
    font-size: 15px;
  }
}
</style>
