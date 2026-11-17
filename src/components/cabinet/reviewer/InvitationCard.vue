<script setup>
/*
 * One review invitation (Figma "Taqriz takliflari"): article info, a short abstract,
 * accept / decline. The DOM order (text first, buttons last) is also the reading order;
 * on wide screens the buttons are moved to the top-right corner by the grid.
 */
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CabButton from '@/components/cabinet/CabButton.vue'
import { formatDate } from '@/i18n/dates'

defineProps({
  article: { type: Object, required: true },
})

defineEmits(['accept', 'decline'])

const { t, locale } = useI18n()
const titleId = `invitation-${useId()}`
</script>

<template>
  <article class="invitation" :aria-labelledby="titleId">
    <div class="invitation__info">
      <h3 :id="titleId" class="invitation__title">{{ article.title }}</h3>
      <p class="invitation__meta">
        <span>{{ t('cabinet.reviewer.article.authors', { authors: article.authors }) }}</span>
        <span>
          {{ t('cabinet.reviewer.article.submitted', { date: formatDate(article.submittedAt, locale) }) }}
        </span>
      </p>
    </div>

    <div class="invitation__abstract">
      <p>{{ article.abstract }}</p>
    </div>

    <div class="invitation__actions">
      <CabButton variant="success" icon="check" :aria-describedby="titleId" @click="$emit('accept')">
        {{ t('cabinet.reviewer.invitations.accept') }}
      </CabButton>
      <CabButton variant="danger-outline" icon="close" :aria-describedby="titleId" @click="$emit('decline')">
        {{ t('cabinet.reviewer.invitations.decline') }}
      </CabButton>
    </div>
  </article>
</template>

<style scoped>
.invitation {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    'info actions'
    'abstract abstract';
  gap: 16px 24px;
  padding: 20px 24px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
}

.invitation__info {
  grid-area: info;
  display: grid;
  gap: 6px;
  min-width: 0;
}

.invitation__title {
  font-size: 17px;
  line-height: 26px;
  font-weight: 600;
  color: var(--cab-text);
}

.invitation__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-subtle);
}

/* padding sits on the wrapper: on the clamped element it would reveal part of the 3rd line */
.invitation__abstract {
  grid-area: abstract;
  padding: 12px 16px;
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.invitation__abstract p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font-size: 14px;
  line-height: 22px;
  color: var(--cab-text-2);
}

.invitation__actions {
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}

@media (max-width: 767.98px) {
  .invitation {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'info'
      'abstract'
      'actions';
    gap: 12px;
    padding: 16px;
  }

  .invitation__title {
    font-size: 16px;
    line-height: 24px;
  }

  .invitation__actions > * {
    flex: 1 1 140px;
  }
}
</style>
