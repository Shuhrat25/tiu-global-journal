<script setup>
import { useI18n } from 'vue-i18n'

// category — направление из API: title, content (описание), posts (сколько статей), files (иконка)
defineProps({
  category: { type: Object, required: true },
})

const { t } = useI18n()
</script>

<template>
  <!-- направление открывается на своей странице /categories/:alias -->
  <RouterLink class="category" :to="'/categories/' + category.alias">
    <div class="category__top">
      <span class="category__icon">
        <img :src="category.files[0].img" alt="" width="32" height="32" />
      </span>
      <span class="category__count">{{ t('categories.count', category.posts) }}</span>
    </div>
    <h3 class="category__title">{{ category.title }}</h3>
    <p class="category__desc">{{ category.content }}</p>
  </RouterLink>
</template>

<style scoped>
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

@media (max-width: 559.98px) {
  .category__title {
    font-size: 18px;
  }

  .category__desc {
    font-size: 15px;
  }
}
</style>
