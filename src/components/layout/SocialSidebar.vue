<script setup>
import { useI18n } from 'vue-i18n'
import { sidebarSocials } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <aside class="social-sidebar" :aria-label="t('socials.label')">
    <ul>
      <li v-for="social in sidebarSocials" :key="social.name">
        <a
          class="social-sidebar__link"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.name"
        >
          <img :src="social.icon" alt="" width="26" height="26" />
        </a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.social-sidebar {
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 40;
  transform: translateY(-50%);
}

.social-sidebar ul {
  display: grid;
  gap: 6px;
}

.social-sidebar__link {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--color-primary-light);
  transition:
    background-color var(--transition),
    width var(--transition);
}

.social-sidebar__link:hover {
  width: 52px;
  background: var(--color-primary);
}

/* On small screens the same links live in the footer */
@media (max-width: 1023.98px) {
  .social-sidebar {
    display: none;
  }
}
</style>
