<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getMenu, menuLink } from '@/api'

const { locale } = useI18n()
const route = useRoute()

const menu = ref([]) // меню с API

async function loadMenu() {
  try {
    menu.value = await getMenu()
  } catch (error) {
    console.error('Не удалось загрузить меню', error)
  }
}

onMounted(loadMenu)
watch(locale, loadMenu)

// Показываем раздел, в котором есть текущая страница.
// Если такого нет — первый раздел («Журнал ҳақида»)
const section = computed(() => {
  const current = menu.value.find(
    (item) => item.children && item.children.some((child) => menuLink(child) === route.path),
  )
  return current || menu.value[0]
})
</script>

<template>
  <aside v-if="section" class="side-menu">
    <h2 class="side-menu__title">{{ section.title }}</h2>
    <ul class="side-menu__list">
      <li v-for="link in section.children" :key="link.id">
        <RouterLink class="side-menu__link" :to="menuLink(link)">{{ link.title }}</RouterLink>
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
