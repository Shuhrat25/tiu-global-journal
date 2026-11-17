<script setup>
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const { t } = useI18n()
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
                <AppIcon :name="category.icon" :size="32" />
              </span>
              <span class="category__count">{{ t('categories.count', category.count) }}</span>
            </div>
            <h3 class="category__title">{{ t(`categories.items.${category.id}.title`) }}</h3>
            <p class="category__desc">{{ t(`categories.items.${category.id}.description`) }}</p>
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
