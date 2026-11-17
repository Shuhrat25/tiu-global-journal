<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ARTICLE_STATUSES, useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { useFullTable } from '@/composables/useMediaQuery'
import { formatDate } from '@/i18n/dates'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import StatCard from '@/components/cabinet/StatCard.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import TableToolbar from '@/components/cabinet/TableToolbar.vue'
import DataTable from '@/components/cabinet/DataTable.vue'
import CabPagination from '@/components/cabinet/CabPagination.vue'
import EmptyState from '@/components/cabinet/EmptyState.vue'
import ActionNotice from '@/components/cabinet/editor/ActionNotice.vue'
import StatGrid from '@/components/cabinet/editor/StatGrid.vue'
import TableTitle from '@/components/cabinet/editor/TableTitle.vue'
import ArticleActions from '@/components/cabinet/editor/ArticleActions.vue'
import InitialCheckModal from '@/components/cabinet/editor/InitialCheckModal.vue'
import ReviewResultModal from '@/components/cabinet/editor/ReviewResultModal.vue'
import FinalDecisionModal from '@/components/cabinet/editor/FinalDecisionModal.vue'
import ArticleDetailsModal from '@/components/cabinet/editor/ArticleDetailsModal.vue'
import PublishConfirmModal from '@/components/cabinet/editor/PublishConfirmModal.vue'

/* Figma comments #13–#18: six status cards that filter the table when clicked */
const STAT_CARDS = [
  { status: 'submitted', icon: 'inbox', tone: 'blue' },
  { status: 'in_review', icon: 'user-check', tone: 'yellow' },
  { status: 'reviewed', icon: 'clipboard-check', tone: 'purple' },
  { status: 'paid', icon: 'credit-card', tone: 'indigo' },
  { status: 'published', icon: 'book-check', tone: 'green' },
  { status: 'rejected', icon: 'x-circle', tone: 'red' },
]

const store = useJournalStore()
const { t, locale } = useI18n()

/* Figma comments #10/#23 search, #19 status filter, #11 period, #25 pagination */
const { search, status, period, from, to, page, pageSize, rows, total, pageCount, isFiltered, reset, toggleStatus } =
  useTableQuery(() => store.allArticles, { pageSize: 8 })

const counts = computed(() => {
  const result = {}
  for (const article of store.allArticles) result[article.status] = (result[article.status] ?? 0) + 1
  return result
})

const statusOptions = computed(() =>
  ARTICLE_STATUSES.map((value) => ({ value, label: t(`cabinet.common.status.${value}`) })),
)

/* in the compact layout the authors, the date and the reviewer are shown under the title */
const fullTable = useFullTable()
const columns = computed(() => [
  { key: 'title', label: t('cabinet.common.table.title') },
  ...(fullTable.value
    ? [
        { key: 'authors', label: t('cabinet.common.table.authors') },
        { key: 'submittedAt', label: t('cabinet.common.table.submitted') },
      ]
    : []),
  { key: 'status', label: t('cabinet.common.table.status') },
  ...(fullTable.value ? [{ key: 'reviewer', label: t('cabinet.common.table.reviewer') }] : []),
  { key: 'actions', label: t('cabinet.common.table.actions'), width: '1%' }, // shrinks to the buttons, the title gets the room
])

/* One dialog at a time. `selected` is kept while a dialog fades out, so its content does not vanish. */
const activeModal = ref('') // '' | check | result | decision | details | publish
const selected = ref(null)
const notice = ref(null)

const selectedReview = computed(() => (selected.value ? store.reviewForArticle(selected.value.id) : null))

function openModal(name, article) {
  selected.value = article
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

const titleId = (article) => `article-title-${article.id}`
</script>

<template>
  <CabPageHeader :title="t('cabinet.editor.dashboard.title')" :subtitle="t('cabinet.editor.dashboard.subtitle')" />
  <ActionNotice :notice="notice" @close="notice = null" />

  <div class="page-body">
    <StatGrid large role="group" :aria-label="t('cabinet.editor.dashboard.statsLabel')">
      <StatCard
        v-for="card in STAT_CARDS"
        :key="card.status"
        :icon="card.icon"
        :tone="card.tone"
        :value="counts[card.status] ?? 0"
        :label="t(`cabinet.editor.dashboard.stats.${card.status}`)"
        clickable
        :active="status === card.status"
        @click="toggleStatus(card.status)"
      />
    </StatGrid>

    <CabPanel :title="t('cabinet.editor.dashboard.tableTitle')" flush>
      <TableToolbar
        v-model:search="search"
        v-model:status="status"
        v-model:period="period"
        v-model:from="from"
        v-model:to="to"
        :status-options="statusOptions"
        :total="total"
        :filtered="isFiltered"
        @reset="reset"
      />

      <DataTable :columns="columns" :rows="rows" :caption="t('cabinet.editor.dashboard.tableTitle')">
        <template #cell-title="{ row }">
          <TableTitle :id="titleId(row)" :title="row.title">
            <template v-if="!fullTable" #default>
              <span>
                {{ row.authors }} ·
                <time :datetime="row.submittedAt" class="cell-nowrap">{{ formatDate(row.submittedAt, locale) }}</time>
              </span>
              <span v-if="row.reviewerId">{{ t('cabinet.editor.article.reviewer', { name: store.userName(row.reviewerId) }) }}</span>
            </template>
          </TableTitle>
        </template>
        <template #cell-authors="{ row }">
          <span class="cell-muted">{{ row.authors }}</span>
        </template>
        <template #cell-submittedAt="{ row }">
          <time :datetime="row.submittedAt" class="cell-nowrap">{{ formatDate(row.submittedAt, locale) }}</time>
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
        <template #cell-reviewer="{ row }">
          <span class="cell-muted">{{ store.userName(row.reviewerId) || '—' }}</span>
        </template>
        <template #cell-actions="{ row }">
          <ArticleActions
            :article="row"
            :described-by="titleId(row)"
            @check="openModal('check', row)"
            @results="openModal('result', row)"
            @decide="openModal('decision', row)"
            @publish="openModal('publish', row)"
            @details="openModal('details', row)"
          />
        </template>
        <template #empty>
          <EmptyState
            :icon="isFiltered ? 'search' : 'inbox'"
            :text="t(isFiltered ? 'cabinet.common.empty.noResults' : 'cabinet.common.empty.table')"
          />
        </template>
      </DataTable>

      <CabPagination v-model:page="page" :page-count="pageCount" :total="total" :page-size="pageSize" />
    </CabPanel>
  </div>

  <InitialCheckModal :open="activeModal === 'check'" :article="selected" @close="closeModal" @done="onDone" />
  <ReviewResultModal :open="activeModal === 'result'" :review="selectedReview" @close="closeModal" @decide="decideFromResult" />
  <FinalDecisionModal :open="activeModal === 'decision'" :article="selected" @close="closeModal" @done="onDone" />
  <ArticleDetailsModal :open="activeModal === 'details'" :article="selected" @close="closeModal" />
  <PublishConfirmModal :open="activeModal === 'publish'" :article="selected" @close="closeModal" @done="onDone" />
</template>

<style scoped>
.page-body {
  display: grid;
  gap: 32px;
}

.cell-muted {
  color: var(--cab-subtle);
}

.cell-nowrap {
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .page-body {
    gap: 24px;
  }
}
</style>
