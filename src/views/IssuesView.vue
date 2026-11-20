<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import { getIssues } from '@/api'

const { t, locale } = useI18n()

const issues = ref([]) // номера журнала с API: title, cover (обложка), alias
const loading = ref(true)

async function loadIssues() {
  loading.value = true
  try {
    issues.value = await getIssues()
  } catch (error) {
    console.error('Не удалось загрузить номера журнала', error)
  }
  loading.value = false
}

onMounted(loadIssues)
watch(locale, loadIssues)
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('pages.issues')" :crumbs="[{ label: t('pages.issues') }]" />

    <div class="container page-content">
      <div class="issues-card">
        <p v-if="loading">{{ t('pages.loading') }}</p>

        <ul v-else class="issues">
          <!-- первый номер в списке — самый новый, он «текущий», остальные — архив -->
          <li v-for="(issue, index) in issues" :key="issue.id">
            <RouterLink class="issue" :to="'/issues/' + issue.alias">
              <span class="issue__cover">
                <img :src="issue.cover" :alt="issue.title" loading="lazy" />
                <span class="issue__badge" :class="{ 'is-current': index === 0 }">
                  {{ index === 0 ? t('pages.currentIssue') : t('pages.archive') }}
                </span>
              </span>
              <span class="issue__title">{{ issue.title }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
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

.issues-card {
  padding: 24px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.issues {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
}

.issue {
  display: grid;
  gap: 14px;
}

.issue__cover {
  position: relative;
  display: block;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-topbar);
}

.issue__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.issue:hover .issue__cover img {
  transform: scale(1.04);
}

.issue__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: 14px;
}

.issue__badge.is-current {
  color: var(--color-primary);
}

.issue__title {
  font-size: 18px;
  line-height: 1.35;
  font-weight: 600;
  color: var(--color-heading);
  transition: color var(--transition);
}

.issue:hover .issue__title {
  color: var(--color-primary);
}

@media (max-width: 1023.98px) {
  .issues {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 479.98px) {
  .issues {
    grid-template-columns: 1fr;
  }
}
</style>
