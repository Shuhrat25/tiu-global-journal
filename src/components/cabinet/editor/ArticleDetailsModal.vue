<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { formatDate } from '@/i18n/dates'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import VerdictChip from '@/components/cabinet/VerdictChip.vue'
import ArticleHeading from './ArticleHeading.vue'
import ArticleFile from './ArticleFile.vue'
import ModalSection from './ModalSection.vue'

/* Read-only article card for the statuses without an editor action (in review, revision, published, rejected) */
const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const store = useJournalStore()
const { t, locale } = useI18n()

const review = computed(() => (props.article ? store.reviewForArticle(props.article.id) : null))
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.editor.details.title')" size="md" @close="emit('close')">
    <div v-if="article" class="details">
      <ArticleHeading :title="article.title">
        <p>{{ t('cabinet.editor.article.authors', { authors: article.authors }) }}</p>
      </ArticleHeading>

      <dl class="facts">
        <div class="facts__row">
          <dt>{{ t('cabinet.common.table.status') }}</dt>
          <dd><StatusBadge :status="article.status" /></dd>
        </div>
        <div class="facts__row">
          <dt>{{ t('cabinet.common.table.submitted') }}</dt>
          <dd>{{ formatDate(article.submittedAt, locale) }}</dd>
        </div>
        <div class="facts__row">
          <dt>{{ t('cabinet.common.table.reviewer') }}</dt>
          <dd>
            {{ store.userName(article.reviewerId) || '—' }}
            <StatusBadge v-if="review && article.reviewerId" :status="review.status" kind="review" />
          </dd>
        </div>
        <div v-if="article.keywords" class="facts__row">
          <dt>{{ t('cabinet.editor.article.keywords') }}</dt>
          <dd>{{ article.keywords }}</dd>
        </div>
        <div v-if="article.conflict" class="facts__row">
          <dt>{{ t('cabinet.editor.article.conflict') }}</dt>
          <dd>{{ article.conflict }}</dd>
        </div>
        <!-- the store clears the decision when a revised version starts a new round -->
        <div v-if="article.decision" class="facts__row">
          <dt>{{ t('cabinet.editor.details.decision') }}</dt>
          <dd><VerdictChip :verdict="article.decision" /></dd>
        </div>
        <div v-if="article.rejectReason" class="facts__row">
          <dt>{{ t('cabinet.editor.details.rejectReason') }}</dt>
          <dd>{{ t(`cabinet.common.rejectReasons.${article.rejectReason}`) }}</dd>
        </div>
      </dl>

      <ArticleFile :article="article" />
      <ModalSection :title="t('cabinet.editor.article.abstract')" :text="article.abstract" />
      <ModalSection v-if="article.editorComment" :title="t('cabinet.editor.details.editorComment')" :text="article.editorComment" />

      <ModalSection v-if="article.history?.length" :title="t('cabinet.editor.details.history')">
        <ol class="history">
          <li v-for="(step, index) in article.history" :key="index" class="history__step">
            <StatusBadge :status="step.status" />
            <time :datetime="step.date">{{ formatDate(step.date, locale) }}</time>
          </li>
        </ol>
      </ModalSection>
    </div>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.close') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.details {
  display: grid;
  gap: 24px;
}

.facts {
  display: grid;
  gap: 12px;
  margin: 0;
}

.facts__row {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: center;
  gap: 4px 24px;
}

.facts dt {
  font-size: 14px;
  line-height: 22px;
  color: var(--cab-muted);
}

.facts dd {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

.history {
  display: grid;
  gap: 10px;
}

.history__step {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-subtle);
}

@media (max-width: 767.98px) {
  .facts__row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
