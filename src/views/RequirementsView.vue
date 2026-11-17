<script setup>
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import PageWithSidebar from '@/components/page/PageWithSidebar.vue'
import { editorialContacts, requirementsContent, requirementsRules } from '@/data/pages'
import checkIcon from '@/assets/icons/check-circle.svg'

const { t } = useI18n()
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('nav.requirements')" :crumbs="[{ label: t('nav.about') }, { label: t('nav.requirements') }]" />

    <PageWithSidebar>
      <article class="content-card">
        <p>{{ t('requirements.intro') }}</p>

        <h2 class="content-card__heading">{{ t('requirements.contentTitle') }}</h2>
        <ul class="bullets">
          <li v-for="key in requirementsContent" :key="key">{{ t(`requirements.content.${key}`) }}</li>
        </ul>

        <h2 class="content-card__heading">{{ t('requirements.rulesTitle') }}</h2>
        <ol class="rules">
          <li v-for="(key, index) in requirementsRules" :key="key" class="rules__item">
            <img :src="checkIcon" alt="" width="24" height="24" />
            <span>{{ index + 1 }}. {{ t(`requirements.rules.${key}`) }}</span>
          </li>
        </ol>

        <p class="content-card__contacts">
          {{ t('requirements.email') }}
          <a :href="`mailto:${editorialContacts.email}`">{{ editorialContacts.email }}</a>
          <br />
          {{ t('requirements.phone') }}
          <a :href="`tel:${editorialContacts.phoneHref}`">{{ editorialContacts.phone }}</a>
        </p>

        <p>
          {{ t('requirements.decision') }}
          <br />
          {{ t('requirements.rights') }}
        </p>
      </article>
    </PageWithSidebar>
  </div>
</template>

<style scoped>
.inner-page {
  background: var(--color-bg-topbar);
}

.content-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  font-size: 18px;
  line-height: 28px;
  color: var(--color-heading);
}

.content-card__heading {
  margin-top: 4px;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
}

.bullets {
  margin-top: -10px;
  padding-left: 22px;
  list-style: disc;
}

.rules {
  display: grid;
  gap: 8px;
  margin-top: -6px;
}

.rules__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.rules__item img {
  flex-shrink: 0;
  margin-top: 2px;
}

.content-card__contacts a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 767.98px) {
  .content-card {
    padding: 16px;
    font-size: 16px;
    line-height: 25px;
  }

  .content-card__heading {
    font-size: 18px;
    line-height: 26px;
  }

  .rules__item img {
    width: 20px;
    height: 20px;
  }
}
</style>
