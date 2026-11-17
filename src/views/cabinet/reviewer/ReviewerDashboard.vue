<script setup>
/*
 * Reviewer cabinet, main page (Figma "Retsenzent" → "Asosiy sahifa"):
 * counters that filter the table, open invitations, and the list of the reviewer's reviews.
 */
import { computed, nextTick, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { formatDate } from '@/i18n/dates'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabNotice from '@/components/cabinet/CabNotice.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import StatCard from '@/components/cabinet/StatCard.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import TableToolbar from '@/components/cabinet/TableToolbar.vue'
import DataTable from '@/components/cabinet/DataTable.vue'
import CabPagination from '@/components/cabinet/CabPagination.vue'
import EmptyState from '@/components/cabinet/EmptyState.vue'
import InvitationCard from '@/components/cabinet/reviewer/InvitationCard.vue'
import ReviewActions from '@/components/cabinet/reviewer/ReviewActions.vue'
import DeclineInvitationModal from '@/components/cabinet/reviewer/DeclineInvitationModal.vue'
import ReviewFormModal from '@/components/cabinet/reviewer/ReviewFormModal.vue'
import ReviewViewModal from '@/components/cabinet/reviewer/ReviewViewModal.vue'
import { hasDraftContent } from '@/components/cabinet/reviewer/review-fields'

const store = useJournalStore()
const { t, locale } = useI18n()
const uid = useId()

/* counters = review statuses; clicking one filters the table (and clicking again clears it) */
const STATS = [
  { status: 'invited', icon: 'clock', tone: 'blue' },
  { status: 'accepted', icon: 'file-text', tone: 'yellow' },
  { status: 'submitted', icon: 'check-circle', tone: 'green' },
]

/*
 * The signed-in reviewer's reviews, each with its article. The date shown in the table and on the
 * invitation cards is the article's submission date, so the rows are sorted (newest first) and
 * filtered by the period by that same date.
 */
const articleDate = (row) => row.article.submittedAt

const reviewRows = computed(() =>
  store.myReviews
    .map((review) => ({ id: review.id, status: review.status, review, article: store.articleById(review.articleId) }))
    .filter((row) => row.article)
    .sort((a, b) => articleDate(b).localeCompare(articleDate(a))),
)

const counts = computed(() =>
  Object.fromEntries(STATS.map(({ status }) => [status, reviewRows.value.filter((row) => row.status === status).length])),
)

const invitations = computed(() => reviewRows.value.filter((row) => row.status === 'invited'))

const {
  search,
  status: statusFilter,
  period,
  from,
  to,
  page,
  pageSize,
  rows: pageRows,
  total,
  pageCount,
  isFiltered,
  reset,
  toggleStatus,
} = useTableQuery(reviewRows, {
  search: (row) => `${row.article.title} ${row.article.authors}`,
  dateOf: articleDate,
  pageSize: 6,
})

const columns = computed(() => [
  { key: 'title', label: t('cabinet.common.table.title') },
  { key: 'authors', label: t('cabinet.common.table.authors') },
  { key: 'submitted', label: t('cabinet.common.table.submitted') },
  { key: 'status', label: t('cabinet.common.table.status') },
  { key: 'actions', label: t('cabinet.common.table.actions') },
])

const titleId = (row) => `${uid}-title-${row.id}`

/* ---------- stat card filter ---------- */
const reviewsPanel = ref(null)

function filterByStatus(status) {
  toggleStatus(status)
  // keyboard users stay on the card they pressed: scrolling away would hide their focused card
  if (statusFilter.value === status && !hasFocusRing()) revealReviews()
}

/* true when the focused element shows a focus ring, i.e. it was reached with the keyboard */
function hasFocusRing() {
  try {
    return Boolean(document.activeElement?.matches(':focus-visible'))
  } catch {
    return false // a browser without :focus-visible
  }
}

/* the table sits below the invitations, so bring it into view when it is far down the screen */
function revealReviews() {
  const panel = reviewsPanel.value?.$el
  if (!panel || panel.getBoundingClientRect().top < window.innerHeight * 0.6) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

/* ---------- result messages ---------- */
const notice = ref(null) // { key, tone, id } — text: cabinet.reviewer.notices.<key>
const noticeBox = ref(null)
let noticeCount = 0

/*
 * Every message is announced by the live region around it. When the button that started
 * the action is gone (the card or the row changed), focus also moves to the message, so it is
 * not lost and the message is scrolled into view; otherwise focus stays where it is.
 */
async function showNotice(key, tone = 'success', { focus = true } = {}) {
  noticeCount += 1
  notice.value = { key, tone, id: noticeCount }
  if (!focus) return
  await nextTick()
  noticeBox.value?.focus()
}

function dismissNotice() {
  notice.value = null
  noticeBox.value?.focus() // the close button is gone — keep keyboard focus in the same place
}

/* ---------- modals ---------- */
const modal = ref(null) // 'decline' | 'form' | 'view' | null
const activeId = ref(null)
// kept after closing, so the dialog still has its content during the closing animation
const activeRow = computed(() => reviewRows.value.find((row) => row.id === activeId.value) ?? null)

function openModal(name, row) {
  activeId.value = row.id
  modal.value = name
}

function closeModal() {
  modal.value = null
}

/* ---------- actions ---------- */
// a dialog's action applies only while its review is still in the expected status:
// the store ignores any other call, so the page must not close the dialog or report a result either
const activeStatusIs = (status) => activeRow.value?.review.status === status

function acceptInvitation(row) {
  store.acceptInvitation(row.id)
  showNotice('accepted')
}

function declineInvitation({ reason, comment }) {
  if (!activeStatusIs('invited')) return
  store.declineInvitation(activeId.value, reason, comment)
  closeModal()
  showNotice('declined', 'info')
}

/* the "write review" button stays in its row and gets the focus back from the dialog */
function saveDraft(form) {
  if (!activeStatusIs('accepted')) return
  store.saveReviewDraft(activeId.value, form)
  closeModal()
  if (hasDraftContent(form)) showNotice('draftSaved', 'success', { focus: false })
  else showNotice('draftCleared', 'info', { focus: false })
}

function submitReview(form) {
  if (!activeStatusIs('accepted')) return
  store.submitReview(activeId.value, form)
  closeModal()
  showNotice('submitted')
}
</script>

<template>
  <div class="reviewer">
    <CabPageHeader :title="t('cabinet.reviewer.title')" :subtitle="t('cabinet.reviewer.subtitle')" />

    <div ref="noticeBox" class="reviewer__notice" tabindex="-1" aria-live="polite">
      <CabNotice
        v-if="notice"
        :key="notice.id"
        :announce="false"
        :tone="notice.tone"
        :text="t(`cabinet.reviewer.notices.${notice.key}`)"
        @close="dismissNotice"
      />
    </div>

    <div class="reviewer__stats">
      <StatCard
        v-for="item in STATS"
        :key="item.status"
        :icon="item.icon"
        :tone="item.tone"
        :value="counts[item.status]"
        :label="t(`cabinet.reviewer.stats.${item.status}`)"
        clickable
        :active="statusFilter === item.status"
        @click="filterByStatus(item.status)"
      />
    </div>

    <CabPanel :title="t('cabinet.reviewer.invitations.title')" class="reviewer__block">
      <div v-if="invitations.length" class="reviewer__invitations">
        <InvitationCard
          v-for="row in invitations"
          :key="row.id"
          :article="row.article"
          @accept="acceptInvitation(row)"
          @decline="openModal('decline', row)"
        />
      </div>
      <EmptyState v-else icon="inbox" :text="t('cabinet.reviewer.invitations.empty')" />
    </CabPanel>

    <CabPanel ref="reviewsPanel" :title="t('cabinet.reviewer.reviews.title')" flush class="reviewer__block">
      <TableToolbar
        v-model:search="search"
        v-model:period="period"
        v-model:from="from"
        v-model:to="to"
        :total="total"
        :filtered="isFiltered"
        @reset="reset"
      />

      <DataTable :columns="columns" :rows="pageRows" :caption="t('cabinet.reviewer.reviews.title')" class="reviewer__table">
        <template #cell-title="{ row }">
          <span :id="titleId(row)" class="reviewer__article">{{ row.article.title }}</span>
          <!-- tablets: authors and date move under the title (their columns are hidden) -->
          <span class="reviewer__article-meta">
            <span>{{ t('cabinet.reviewer.article.authors', { authors: row.article.authors }) }}</span>
            <span>
              {{ t('cabinet.reviewer.article.submitted', { date: formatDate(row.article.submittedAt, locale) }) }}
            </span>
          </span>
        </template>
        <template #cell-authors="{ row }">{{ row.article.authors }}</template>
        <template #cell-submitted="{ row }">
          <time :datetime="row.article.submittedAt" class="reviewer__date">
            {{ formatDate(row.article.submittedAt, locale) }}
          </time>
        </template>
        <template #cell-status="{ row }">
          <div class="reviewer__status">
            <StatusBadge :status="row.status" kind="review" />
            <span v-if="row.status === 'accepted' && hasDraftContent(row.review.draft)" class="reviewer__draft">
              <AppIcon name="pen-line" :size="14" />
              {{ t('cabinet.reviewer.reviews.draft') }}
            </span>
          </div>
        </template>
        <template #cell-actions="{ row }">
          <ReviewActions
            :review="row.review"
            :article="row.article"
            :describedby="titleId(row)"
            @accept="acceptInvitation(row)"
            @decline="openModal('decline', row)"
            @write="openModal('form', row)"
            @view="openModal('view', row)"
          />
        </template>
        <template #empty>
          <EmptyState
            :icon="isFiltered ? 'search' : 'inbox'"
            :text="isFiltered ? t('cabinet.common.empty.noResults') : t('cabinet.common.empty.table')"
          />
        </template>
      </DataTable>

      <CabPagination v-model:page="page" :page-count="pageCount" :total="total" :page-size="pageSize" />
    </CabPanel>

    <DeclineInvitationModal
      :open="modal === 'decline'"
      :article="activeRow?.article ?? null"
      @close="closeModal"
      @submit="declineInvitation"
    />
    <ReviewFormModal
      :open="modal === 'form'"
      :review="activeRow?.review ?? null"
      :article="activeRow?.article ?? null"
      @close="closeModal"
      @save-draft="saveDraft"
      @submit="submitReview"
    />
    <ReviewViewModal
      :open="modal === 'view'"
      :review="activeRow?.review ?? null"
      :article="activeRow?.article ?? null"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.reviewer__notice {
  scroll-margin-top: 24px;
}

.reviewer__notice:focus {
  outline: none;
}

.reviewer__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.reviewer__block {
  margin-top: 32px;
  scroll-margin-top: 24px;
}

.reviewer__invitations {
  display: grid;
  gap: 16px;
}

.reviewer__article {
  font-weight: 500;
}

.reviewer__article-meta {
  display: none;
}

.reviewer__date {
  white-space: nowrap;
}

.reviewer__status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.reviewer__draft {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}

/*
 * Five columns don't fit between the phone card layout (< 768px) and 1280px:
 * the "authors" and "date" columns (2nd and 3rd) are hidden and shown under the title instead,
 * so the action buttons stay on screen without horizontal scrolling.
 */
@media (min-width: 768px) and (max-width: 1279.98px) {
  .reviewer__table :deep(th:nth-child(2)),
  .reviewer__table :deep(td:nth-child(2)),
  .reviewer__table :deep(th:nth-child(3)),
  .reviewer__table :deep(td:nth-child(3)) {
    display: none;
  }

  .reviewer__article-meta {
    display: grid;
    gap: 2px;
    margin-top: 4px;
    font-size: 13px;
    line-height: 18px;
    color: var(--cab-muted);
  }
}

/* tablet: 2 counters per row, the odd last one takes the whole row */
@media (max-width: 1023.98px) {
  .reviewer__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .reviewer__stats > :last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }

  /* clear the sticky top bar of the cabinet layout */
  .reviewer__notice,
  .reviewer__block {
    scroll-margin-top: 88px;
  }
}

@media (max-width: 767.98px) {
  .reviewer__stats {
    gap: 16px;
  }

  .reviewer__block {
    margin-top: 24px;
  }
}

@media (max-width: 639.98px) {
  .reviewer__stats {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
