<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { useFullTable } from '@/composables/useMediaQuery'
import { formatDate } from '@/i18n/dates'
import { formatAmount } from '@/utils/format'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import StatCard from '@/components/cabinet/StatCard.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import TableToolbar from '@/components/cabinet/TableToolbar.vue'
import DataTable from '@/components/cabinet/DataTable.vue'
import CabPagination from '@/components/cabinet/CabPagination.vue'
import EmptyState from '@/components/cabinet/EmptyState.vue'
import ActionNotice from '@/components/cabinet/editor/ActionNotice.vue'
import StatGrid from '@/components/cabinet/editor/StatGrid.vue'
import TableTitle from '@/components/cabinet/editor/TableTitle.vue'
import PublishConfirmModal from '@/components/cabinet/editor/PublishConfirmModal.vue'

/*
 * Figma comment #12: who paid, for which article, how much and how; once the money
 * has arrived the article goes to print, so it can be marked as published here.
 */
const store = useJournalStore()
const { t, locale } = useI18n()

const paymentRows = computed(() =>
  store.allPayments.map((payment) => ({ ...payment, article: store.articleById(payment.articleId) })),
)

const { search, status, period, from, to, page, pageSize, rows, total, pageCount, isFiltered, reset, toggleStatus } =
  useTableQuery(paymentRows, {
    search: (row) => `${row.payer} ${row.article.title} ${row.article.authors}`,
    statusOf: (row) => row.article.status,
    dateOf: (row) => row.paidAt,
    pageSize: 8,
  })

const money = (amount) => t('cabinet.common.currency', { amount: formatAmount(amount) })
const methodLabel = (method) => t(`cabinet.common.paymentMethods.${method}`)
const totalReceived = computed(() => store.allPayments.reduce((sum, payment) => sum + payment.amount, 0))
const awaitingCount = computed(() => store.allArticles.filter((article) => article.status === 'paid').length)

/* a paid article is either waiting for print or already published */
const statusOptions = computed(() => [
  { value: 'paid', label: t('cabinet.editor.payments.awaiting') },
  { value: 'published', label: t('cabinet.common.status.published') },
])

/*
 * "status" holds the action while the article waits for print and the badge once it is published.
 * In the compact layout the payer and the date go under the article, the method under the amount.
 */
const fullTable = useFullTable()
const columns = computed(() => [
  ...(fullTable.value ? [{ key: 'payer', label: t('cabinet.common.table.payer') }] : []),
  { key: 'article', label: t('cabinet.common.table.article') },
  { key: 'amount', label: t('cabinet.common.table.amount') },
  ...(fullTable.value
    ? [
        { key: 'method', label: t('cabinet.common.table.method') },
        { key: 'paidAt', label: t('cabinet.common.table.date') },
      ]
    : []),
  { key: 'status', label: t('cabinet.common.table.status') },
])

const confirmOpen = ref(false)
const selected = ref(null) // article, kept while the dialog fades out
const notice = ref(null)

function askPublish(article) {
  selected.value = article
  confirmOpen.value = true
}

function onPublished(result) {
  confirmOpen.value = false
  notice.value = result
}

const titleId = (row) => `payment-article-${row.id}`
</script>

<template>
  <CabPageHeader :title="t('cabinet.common.nav.payments')" :subtitle="t('cabinet.editor.payments.subtitle')" />
  <ActionNotice :notice="notice" @close="notice = null" />

  <div class="page-body">
    <StatGrid>
      <StatCard icon="wallet" tone="green" :value="money(totalReceived)" :label="t('cabinet.editor.payments.total')" />
      <StatCard icon="credit-card" tone="blue" :value="store.allPayments.length" :label="t('cabinet.editor.payments.count')" />
      <StatCard
        icon="clock"
        tone="indigo"
        :value="awaitingCount"
        :label="t('cabinet.editor.payments.awaiting')"
        clickable
        :active="status === 'paid'"
        @click="toggleStatus('paid')"
      />
    </StatGrid>

    <CabPanel :title="t('cabinet.editor.payments.tableTitle')" flush>
      <TableToolbar
        v-model:search="search"
        v-model:status="status"
        v-model:period="period"
        v-model:from="from"
        v-model:to="to"
        :status-options="statusOptions"
        :search-placeholder="t('cabinet.common.filters.searchPlaceholderPayments')"
        :total="total"
        :filtered="isFiltered"
        @reset="reset"
      />

      <DataTable :columns="columns" :rows="rows" :caption="t('cabinet.editor.payments.tableTitle')">
        <template #cell-article="{ row }">
          <TableTitle :id="titleId(row)" :title="row.article.title">
            <template v-if="!fullTable" #default>
              <span>
                {{ row.payer }} · <time :datetime="row.paidAt" class="cell-nowrap">{{ formatDate(row.paidAt, locale) }}</time>
              </span>
            </template>
          </TableTitle>
        </template>
        <template #cell-amount="{ row }">
          <div class="cell-amount">
            <span class="cell-nowrap">{{ money(row.amount) }}</span>
            <span v-if="!fullTable" class="cell-sub">{{ methodLabel(row.method) }}</span>
          </div>
        </template>
        <template #cell-method="{ row }">
          {{ methodLabel(row.method) }}
        </template>
        <template #cell-paidAt="{ row }">
          <time :datetime="row.paidAt" class="cell-nowrap">{{ formatDate(row.paidAt, locale) }}</time>
        </template>
        <template #cell-status="{ row }">
          <CabButton
            v-if="row.article.status === 'paid'"
            size="sm"
            variant="success"
            icon="book-check"
            :aria-describedby="titleId(row)"
            @click="askPublish(row.article)"
          >
            <span class="button-label">{{ t('cabinet.editor.actions.markPublished') }}</span>
          </CabButton>
          <StatusBadge v-else :status="row.article.status" />
        </template>
        <template #empty>
          <EmptyState
            :icon="isFiltered ? 'search' : 'wallet'"
            :text="t(isFiltered ? 'cabinet.common.empty.noResults' : 'cabinet.common.empty.payments')"
          />
        </template>
      </DataTable>

      <CabPagination v-model:page="page" :page-count="pageCount" :total="total" :page-size="pageSize" />
    </CabPanel>
  </div>

  <PublishConfirmModal :open="confirmOpen" :article="selected" @close="confirmOpen = false" @done="onPublished" />
</template>

<style scoped>
.page-body {
  display: grid;
  gap: 32px;
}

.cell-nowrap {
  white-space: nowrap;
}

.cell-amount {
  display: grid;
  gap: 2px;
}

.cell-sub {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}

@media (max-width: 767.98px) {
  .page-body {
    gap: 24px;
  }

  /* the long label wraps inside the narrow phone card instead of overflowing it */
  .button-label {
    white-space: normal;
  }
}
</style>
