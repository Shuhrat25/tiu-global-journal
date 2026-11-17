<script setup>
/* A submitted review, read-only: the same sections as the form, plus the date and the verdict */
import { useI18n } from 'vue-i18n'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import VerdictChip from '@/components/cabinet/VerdictChip.vue'
import ArticleSummary from './ArticleSummary.vue'
import { REVIEW_TEXT_FIELDS } from './review-fields'
import { formatDate } from '@/i18n/dates'

defineProps({
  open: { type: Boolean, default: false },
  review: { type: Object, default: null },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { t, locale } = useI18n()
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.reviewer.view.title')" size="md" @close="emit('close')">
    <template v-if="review && article">
      <ArticleSummary :article="article" class="review-view__summary" />

      <dl class="review-view__meta">
        <div v-if="review.submittedAt">
          <dt>{{ t('cabinet.reviewer.view.submittedAt') }}</dt>
          <dd>
            <time :datetime="review.submittedAt">{{ formatDate(review.submittedAt, locale) }}</time>
          </dd>
        </div>
        <div v-if="review.verdict">
          <dt>{{ t('cabinet.reviewer.form.verdict') }}</dt>
          <dd><VerdictChip :verdict="review.verdict" /></dd>
        </div>
      </dl>

      <section v-for="field in REVIEW_TEXT_FIELDS" :key="field" class="review-view__section">
        <h3 class="review-view__label">{{ t(`cabinet.common.review.${field}`) }}</h3>
        <p class="review-view__text">{{ review[field] }}</p>
      </section>
    </template>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.close') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.review-view__summary {
  margin-bottom: 20px;
}

.review-view__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 40px;
  margin-bottom: 8px;
}

.review-view__meta div {
  display: grid;
  gap: 6px;
}

.review-view__meta dt {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cab-muted);
}

.review-view__meta dd {
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  color: var(--cab-text);
}

.review-view__section {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--cab-border);
}

.review-view__label {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--cab-text-2);
}

.review-view__text {
  font-size: 15px;
  line-height: 24px;
  color: var(--cab-text);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
