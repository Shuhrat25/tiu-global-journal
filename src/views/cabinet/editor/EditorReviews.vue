<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FINAL_DECISIONS, useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { useFullTable } from '@/composables/useMediaQuery'
import { formatDate } from '@/i18n/dates'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import VerdictChip from '@/components/cabinet/VerdictChip.vue'
import TableToolbar from '@/components/cabinet/TableToolbar.vue'
import DataTable from '@/components/cabinet/DataTable.vue'
import CabPagination from '@/components/cabinet/CabPagination.vue'
import EmptyState from '@/components/cabinet/EmptyState.vue'
import ActionNotice from '@/components/cabinet/editor/ActionNotice.vue'
import TableTitle from '@/components/cabinet/editor/TableTitle.vue'
import ReviewResultModal from '@/components/cabinet/editor/ReviewResultModal.vue'
import FinalDecisionModal from '@/components/cabinet/editor/FinalDecisionModal.vue'
import { awaitsDecision } from '@/components/cabinet/editor/awaitsDecision'

/* Figma comment #20: a separate section where all reviewers' conclusions arrive */
const store = useJournalStore()
const { t, locale } = useI18n()

const reviewRows = computed(() =>
  store.submittedReviews.map((review) => ({
    ...review,
    article: store.articleById(review.articleId),
    reviewerName: store.userName(review.reviewerId),
    awaitsDecision: awaitsDecision(store, review),
  })),
)

const { search, status, period, from, to, page, pageSize, rows, total, pageCount, isFiltered, reset } = useTableQuery(
  reviewRows,
  {
    search: (row) => `${row.article.title} ${row.article.authors} ${row.reviewerName}`,
    statusOf: (row) => row.verdict,
    dateOf: (row) => row.submittedAt,
    pageSize: 8,
  },
)

const verdictOptions = computed(() =>
  FINAL_DECISIONS.map((value) => ({ value, label: t(`cabinet.common.decisions.${value}`) })),
)

/* in the compact layout the reviewer, the date and the recommendation are shown under the article title */
const fullTable = useFullTable()
const columns = computed(() => [
  { key: 'article', label: t('cabinet.common.table.article') },
  ...(fullTable.value
    ? [
        { key: 'reviewer', label: t('cabinet.common.table.reviewer') },
        { key: 'submittedAt', label: t('cabinet.common.table.date') },
        { key: 'verdict', label: t('cabinet.common.table.verdict') },
      ]
    : []),
  { key: 'articleStatus', label: t('cabinet.editor.reviews.articleStatus') },
  { key: 'actions', label: t('cabinet.common.table.actions'), width: '1%' }, // shrinks to the buttons, the title gets the room
])

/* One dialog at a time. `selected` (a review row) is kept while a dialog fades out. */
const activeModal = ref('') // '' | result | decision
const selected = ref(null)
const notice = ref(null)

function openModal(name, row) {
  selected.value = row
  activeModal.value = name
}

function closeModal() {
  activeModal.value = ''
}

// "Якуний қарор" inside the review result: close that dialog first, then open the decision form
async function decideFromResult() {
  closeModal()
  await nextTick()
  activeModal.value = 'decision'
}

function onDone(result) {
  closeModal()
  notice.value = result
}

const titleId = (row) => `review-article-${row.id}`
</script>

<template>
  <CabPageHeader :title="t('cabinet.common.nav.reviews')" :subtitle="t('cabinet.editor.reviews.subtitle')" />
  <ActionNotice :notice="notice" @close="notice = null" />

  <CabPanel :title="t('cabinet.editor.reviews.tableTitle')" flush>
    <TableToolbar
      v-model:search="search"
      v-model:status="status"
      v-model:period="period"
      v-model:from="from"
      v-model:to="to"
      :status-options="verdictOptions"
      :search-placeholder="t('cabinet.common.filters.searchPlaceholderReviews')"
      :status-label="t('cabinet.common.filters.verdict')"
      :all-label="t('cabinet.common.filters.allVerdicts')"
      :total="total"
      :filtered="isFiltered"
      @reset="reset"
    />

    <DataTable :columns="columns" :rows="rows" :caption="t('cabinet.editor.reviews.tableTitle')">
      <template #cell-article="{ row }">
        <TableTitle :id="titleId(row)" :title="row.article.title">
          <template v-if="!fullTable" #default>
            <span>
              {{ row.reviewerName }} ·
              <time :datetime="row.submittedAt" class="cell-nowrap">{{ formatDate(row.submittedAt, locale) }}</time>
            </span>
            <VerdictChip v-if="row.verdict" :verdict="row.verdict" class="title-verdict" />
          </template>
        </TableTitle>
      </template>
      <template #cell-reviewer="{ row }">
        <span class="cell-muted">{{ row.reviewerName }}</span>
      </template>
      <template #cell-submittedAt="{ row }">
        <time :datetime="row.submittedAt" class="cell-nowrap">{{ formatDate(row.submittedAt, locale) }}</time>
      </template>
      <template #cell-verdict="{ row }">
        <VerdictChip v-if="row.verdict" :verdict="row.verdict" />
      </template>
      <template #cell-articleStatus="{ row }">
        <StatusBadge :status="row.article.status" />
      </template>
      <template #cell-actions="{ row }">
        <div class="row-actions">
          <CabButton size="sm" variant="soft" icon="eye" :aria-describedby="titleId(row)" @click="openModal('result', row)">
            {{ t('cabinet.editor.actions.view') }}
          </CabButton>
          <CabButton
            v-if="row.awaitsDecision"
            size="sm"
            icon="check-circle"
            :aria-describedby="titleId(row)"
            @click="openModal('decision', row)"
          >
            {{ t('cabinet.editor.actions.decide') }}
          </CabButton>
        </div>
      </template>
      <template #empty>
        <EmptyState
          :icon="isFiltered ? 'search' : 'clipboard-check'"
          :text="t(isFiltered ? 'cabinet.common.empty.noResults' : 'cabinet.editor.reviews.empty')"
        />
      </template>
    </DataTable>

    <CabPagination v-model:page="page" :page-count="pageCount" :total="total" :page-size="pageSize" />
  </CabPanel>

  <ReviewResultModal :open="activeModal === 'result'" :review="selected" @close="closeModal" @decide="decideFromResult" />
  <FinalDecisionModal :open="activeModal === 'decision'" :article="selected?.article" @close="closeModal" @done="onDone" />
</template>

<style scoped>
.cell-muted {
  color: var(--cab-subtle);
}

.cell-nowrap {
  white-space: nowrap;
}

/* a line of the title's meta grid: the chip keeps its own width */
.title-verdict {
  justify-self: start;
  margin-top: 4px;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
