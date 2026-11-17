<script setup>
import { useI18n } from 'vue-i18n'
import buildingImage from '@/assets/images/university-building.jpg'
import homeIcon from '@/assets/icons/home.svg'

defineProps({
  title: { type: String, required: true },
  /** [{ label, to? }] — the home crumb is added automatically */
  crumbs: { type: Array, default: () => [] },
})

const { t } = useI18n()
</script>

<template>
  <section class="page-banner">
    <img class="page-banner__bg" :src="buildingImage" alt="" />
    <div class="container page-banner__inner">
      <nav class="crumbs" :aria-label="t('common.breadcrumbs')">
        <ol class="crumbs__list">
          <li class="crumbs__item">
            <RouterLink to="/" class="crumbs__link" :aria-label="t('common.home')">
              <img :src="homeIcon" alt="" width="16" height="16" />
            </RouterLink>
          </li>
          <li v-for="(crumb, index) in crumbs" :key="index" class="crumbs__item">
            <RouterLink v-if="crumb.to" :to="crumb.to" class="crumbs__link">{{ crumb.label }}</RouterLink>
            <span v-else :aria-current="index === crumbs.length - 1 ? 'page' : undefined">{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>
      <h1 class="page-banner__title">{{ title }}</h1>
    </div>
  </section>
</template>

<style scoped>
.page-banner {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--color-footer);
  color: var(--color-white);
}

.page-banner__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
}

/* dark overlay so the white title stays readable */
.page-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(16 24 40 / 0.55);
}

.page-banner__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-height: 236px;
  padding-block: 50px 80px;
  text-align: center;
}

.crumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px 12px;
  padding: 10px 12px;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 0.12);
  backdrop-filter: blur(6px);
  font-size: 16px;
  line-height: 22px;
}

.crumbs__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crumbs__item + .crumbs__item::before {
  content: '/';
  opacity: 0.7;
}

.crumbs__link {
  display: flex;
  align-items: center;
  opacity: 0.85;
  transition: opacity var(--transition);
}

.crumbs__link:hover {
  opacity: 1;
}

.page-banner__title {
  font-size: clamp(26px, 2vw + 14px, 40px);
  line-height: 1.3;
  font-weight: 600;
  text-wrap: balance;
}

@media (max-width: 767.98px) {
  .page-banner__inner {
    min-height: 0;
    padding-block: 32px 64px;
  }

  .crumbs__list {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
