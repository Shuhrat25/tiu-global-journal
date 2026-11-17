<script setup>
/*
 * Author payments (Figma comment #6): the author pays a fee to publish an accepted article;
 * the history keeps when, for which article, how much and how it was paid.
 */
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ARTICLE_FEE, useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { useFullTable } from '@/composables/useMediaQuery'
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
import PayArticleModal from '@/components/cabinet/author/PayArticleModal.vue'
import PageNotice from '@/components/cabinet/author/PageNotice.vue'
import StatGrid from '@/components/cabinet/author/StatGrid.vue'
import CellText from '@/components/cabinet/author/CellText.vue'
import DateText from '@/components/cabinet/author/DateText.vue'

const store = useJournalStore()
const { t } = useI18n()

const currency = (amount) => t('cabinet.common.currency', { amount: formatAmount(amount) })

/* accepted articles wait for the publication fee */
const awaiting = computed(() => store.myArticles.filter((article) => article.status === 'accepted'))
const payments = computed(() =>
  store.myPayments.map((payment) => ({ ...payment, article: store.articleById(payment.articleId) })),
)
const totalPaid = computed(() => store.myPayments.reduce((sum, payment) => sum + payment.amount, 0))

const stats = computed(() => [
  { key: 'totalPaid', icon: 'wallet', tone: 'green', value: currency(totalPaid.value) },
  { key: 'count', icon: 'credit-card', tone: 'blue', value: store.myPayments.length },
  { key: 'awaiting', icon: 'clock', tone: 'orange', value: awaiting.value.length },
])

const history = reactive(
  useTableQuery(payments, {
    search: (payment) => `${payment.article?.title ?? ''} ${payment.article?.authors ?? ''}`,
    dateOf: (payment) => payment.paidAt,
    pageSize: 8,
  }),
)

const awaitingColumns = computed(() => [
  { key: 'title', label: t('cabinet.common.table.article') },
  { key: 'amount', label: t('cabinet.common.table.amount') },
  { key: 'actions', label: t('cabinet.common.table.actions'), width: '1%' }, // shrinks to the button
])

/* in the compact layout the payment method is shown under the amount */
const fullTable = useFullTable()
const historyColumns = computed(() => [
  { key: 'paidAt', label: t('cabinet.common.table.date') },
  { key: 'article', label: t('cabinet.common.table.article') },
  { key: 'amount', label: t('cabinet.common.table.amount') },
  ...(fullTable.value ? [{ key: 'method', label: t('cabinet.common.table.method') }] : []),
  { key: 'status', label: t('cabinet.common.table.status') },
])

const methodLabel = (method) => t(`cabinet.common.paymentMethods.${method}`)

const payOpen = ref(false)
const payTarget = ref(null)

function openPay(article) {
  payTarget.value = article
  payOpen.value = true
}

/* success message above the counters: the key and params of its text, a new object for every message */
const notice = ref(null)

function onPaid(article) {
  payOpen.value = false
  notice.value = { key: 'cabinet.author.notices.paid', params: { title: article.title } }
}
</script>

<template>
  <CabPageHeader :title="t('cabinet.common.nav.payments')" :subtitle="t('cabinet.author.payments.subtitle')" />

  <PageNotice :notice="notice" @close="notice = null" />

  <div class="payments">
    <StatGrid :columns="3">
      <StatCard
        v-for="card in stats"
        :key="card.key"
        :icon="card.icon"
        :tone="card.tone"
        :value="card.value"
        :label="t(`cabinet.author.payments.${card.key}`)"
      />
    </StatGrid>

    <CabPanel v-if="awaiting.length" :title="t('cabinet.author.payments.awaiting')" flush>
      <DataTable :columns="awaitingColumns" :rows="awaiting" :caption="t('cabinet.author.payments.awaiting')">
        <template #cell-title="{ row }">
          <CellText :id="`awaiting-${row.id}`" :text="row.title" />
        </template>
        <template #cell-amount>
          <CellText :text="currency(ARTICLE_FEE)" nowrap />
        </template>
        <template #cell-actions="{ row }">
          <CabButton
            variant="success"
            size="sm"
            icon="credit-card"
            :aria-describedby="`awaiting-${row.id}`"
            @click="openPay(row)"
          >
            {{ t('cabinet.author.payments.pay') }}
          </CabButton>
        </template>
      </DataTable>
    </CabPanel>

    <CabPanel :title="t('cabinet.author.payments.history')" flush>
      <TableToolbar
        v-model:search="history.search"
        v-model:period="history.period"
        v-model:from="history.from"
        v-model:to="history.to"
        :total="history.total"
        :filtered="history.isFiltered"
        @reset="history.reset()"
      />

      <DataTable :columns="historyColumns" :rows="history.rows" :caption="t('cabinet.author.payments.history')">
        <template #cell-paidAt="{ row }">
          <DateText :date="row.paidAt" />
        </template>
        <template #cell-article="{ row }">
          <CellText :text="row.article?.title ?? ''" />
        </template>
        <template #cell-amount="{ row }">
          <CellText :text="currency(row.amount)" nowrap>
            <template v-if="!fullTable" #default>{{ methodLabel(row.method) }}</template>
          </CellText>
        </template>
        <template #cell-method="{ row }">
          {{ methodLabel(row.method) }}
        </template>
        <template #cell-status="{ row }">
          <StatusBadge v-if="row.article" :status="row.article.status" />
        </template>
        <template #empty>
          <EmptyState v-if="store.myPayments.length" icon="search" :text="t('cabinet.common.empty.noResults')" />
          <EmptyState v-else icon="wallet" :text="t('cabinet.common.empty.payments')" />
        </template>
      </DataTable>

      <CabPagination
        v-model:page="history.page"
        :page-count="history.pageCount"
        :total="history.total"
        :page-size="history.pageSize"
      />
    </CabPanel>
  </div>

  <PayArticleModal :open="payOpen" :article="payTarget" @close="payOpen = false" @paid="onPaid" />
</template>

<style scoped>
.payments {
  display: grid;
  gap: 32px;
}

@media (max-width: 767.98px) {
  .payments {
    gap: 24px;
  }
}
</style>
