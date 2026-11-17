<script setup>
import { useI18n } from 'vue-i18n'
import { aboutLinks } from '@/data/site'
import AppLink from '@/components/ui/AppLink.vue'

const { t } = useI18n()
</script>

<template>
  <aside class="side-menu">
    <h2 class="side-menu__title">{{ t('nav.about') }}</h2>
    <ul class="side-menu__list">
      <li v-for="link in aboutLinks" :key="link.key">
        <AppLink class="side-menu__link" :to="link.to" :href="link.href">{{ t(`nav.${link.key}`) }}</AppLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.side-menu {
  overflow: hidden;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.side-menu__title {
  padding: 14px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-primary-soft);
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: var(--color-primary);
}

.side-menu__list {
  display: grid;
  gap: 4px;
  padding: 10px 6px 12px;
}

.side-menu__link {
  position: relative;
  display: block;
  padding: 6px 8px 6px 28px;
  border-radius: var(--radius-sm);
  font-size: 18px;
  line-height: 23px;
  color: var(--color-text-nav);
  transition:
    color var(--transition),
    background-color var(--transition);
}

.side-menu__link:hover {
  background: var(--color-bg-soft);
  color: var(--color-primary);
}

/* active page: blue text + round marker */
.side-menu__link.router-link-exact-active {
  color: var(--color-primary);
}

.side-menu__link.router-link-exact-active::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid var(--color-primary-soft);
  background: var(--color-primary);
  box-sizing: border-box;
}
</style>
