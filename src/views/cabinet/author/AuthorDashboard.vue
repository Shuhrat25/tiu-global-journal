<script setup>
/* Author dashboard (Figma "Muallif" → "Asosiy sahifa"): counters, my articles, latest notifications */
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { useTableQuery } from '@/composables/useTableQuery'
import { useFullTable } from '@/composables/useMediaQuery'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import StatCard from '@/components/cabinet/StatCard.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import TableToolbar from '@/components/cabinet/TableToolbar.vue'
import DataTable from '@/components/cabinet/DataTable.vue'
import CabPagination from '@/components/cabinet/CabPagination.vue'
import EmptyState from '@/components/cabinet/EmptyState.vue'
import NotificationList from '@/components/cabinet/NotificationList.vue'
import SubmitArticleWizard from '@/components/cabinet/author/SubmitArticleWizard.vue'
import EditorCommentsModal from '@/components/cabinet/author/EditorCommentsModal.vue'
import PayArticleModal from '@/components/cabinet/author/PayArticleModal.vue'
import ArticleDetailsModal from '@/components/cabinet/author/ArticleDetailsModal.vue'
import ArticleRowActions from '@/components/cabinet/author/ArticleRowActions.vue'
import PageNotice from '@/components/cabinet/author/PageNotice.vue'
import StatGrid from '@/components/cabinet/author/StatGrid.vue'
import CellText from '@/components/cabinet/author/CellText.vue'
import DateText from '@/components/cabinet/author/DateText.vue'

/* Counters (Figma comment #4: every card has its own colour); a click filters the table by the statuses */
const STAT_CARDS = [
  { key: 'all', icon: 'file-text', tone: 'blue' },
  { key: 'inProgress', icon: 'clock', tone: 'yellow', statuses: ['submitted', 'in_review', 'reviewed'] },
  { key: 'accepted', icon: 'check-circle', tone: 'green', statuses: ['accepted', 'paid', 'published'] },
  { key: 'revision', icon: 'alert-circle', tone: 'orange', statuses: ['revision'] },
]
const STATUS_GROUPS = Object.fromEntries(STAT_CARDS.filter((card) => card.statuses).map((card) => [card.key, card.statuses]))

const store = useJournalStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const articles = reactive(useTableQuery(() => store.myArticles, { groups: STATUS_GROUPS, pageSize: 5 }))

const stats = computed(() =>
  STAT_CARDS.map((card) => ({
    ...card,
    value: card.statuses
      ? store.myArticles.filter((article) => card.statuses.includes(article.status)).length
      : store.myArticles.length,
  })),
)

/* in the compact layout the authors and the date are shown under the title */
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
  { key: 'actions', label: t('cabinet.common.table.actions'), width: '1%' }, // shrinks to the buttons, the title gets the room
])

const latestNotifications = computed(() => store.myNotifications.slice(0, 3))

/* one dialog at a time; `selected` is the article a row dialog is about */
const dialog = ref(null) // 'submit' | 'comments' | 'pay' | 'details'
const selected = ref(null)

function openDialog(name, article = null) {
  if (article) selected.value = article
  dialog.value = name
}

function closeDialog() {
  dialog.value = null
}

/* success message above the counters: the key and params of its text, a new object for every message */
const notice = ref(null)

function showNotice(key, params) {
  closeDialog()
  notice.value = { key, params }
}

function onSubmitted() {
  // show the new article: it is the first row once the filters are cleared
  articles.reset()
  articles.page = 1
  showNotice('cabinet.author.notices.submitted')
}

const onRevisionUploaded = (article) => showNotice('cabinet.author.notices.revisionUploaded', { title: article.title })
const onPaid = (article) => showNotice('cabinet.author.notices.paid', { title: article.title })

/*
 * The site's "submit an article" buttons link here with ?submit=1: the wizard opens and the
 * parameter is removed, so a reload or a step back in the history does not open it again.
 * It opens once the page is mounted, so it fades in like a dialog opened with the button.
 */
function openWizardFromQuery() {
  if (route.query.submit !== '1') return
  openDialog('submit')
  const query = { ...route.query }
  delete query.submit
  router.replace({ query })
}

onMounted(openWizardFromQuery)
watch(() => route.query.submit, openWizardFromQuery)
</script>

<template>
  <CabPageHeader :title="t('cabinet.author.dashboard.title')" :subtitle="t('cabinet.author.dashboard.subtitle')">
    <template #actions>
      <CabButton size="lg" icon="plus" @click="openDialog('submit')">{{ t('cabinet.author.dashboard.newArticle') }}</CabButton>
    </template>
  </CabPageHeader>

  <PageNotice :notice="notice" @close="notice = null" />

  <div class="dashboard">
    <StatGrid :columns="4">
      <StatCard
        v-for="card in stats"
        :key="card.key"
        :icon="card.icon"
        :tone="card.tone"
        :value="card.value"
        :label="t(`cabinet.author.stats.${card.key}`)"
        clickable
        :active="articles.status === card.key"
        @click="articles.toggleStatus(card.key)"
      />
    </StatGrid>

    <CabPanel :title="t('cabinet.author.dashboard.myArticles')" flush>
      <TableToolbar
        v-model:search="articles.search"
        v-model:period="articles.period"
        v-model:from="articles.from"
        v-model:to="articles.to"
        :total="articles.total"
        :filtered="articles.isFiltered"
        @reset="articles.reset()"
      />

      <DataTable :columns="columns" :rows="articles.rows" :caption="t('cabinet.author.dashboard.myArticles')">
        <template #cell-title="{ row }">
          <CellText :id="`article-${row.id}`" :text="row.title">
            <template v-if="!fullTable" #default>{{ row.authors }} · <DateText :date="row.submittedAt" /></template>
          </CellText>
        </template>
        <template #cell-authors="{ row }">
          <span class="cell-muted">{{ row.authors }}</span>
        </template>
        <template #cell-submittedAt="{ row }">
          <DateText :date="row.submittedAt" />
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
        <template #cell-actions="{ row }">
          <ArticleRowActions
            :article="row"
            :described-by="`article-${row.id}`"
            @comments="openDialog('comments', row)"
            @pay="openDialog('pay', row)"
            @details="openDialog('details', row)"
          />
        </template>
        <template #empty>
          <EmptyState v-if="store.myArticles.length" icon="search" :text="t('cabinet.common.empty.noResults')" />
          <EmptyState v-else icon="file-text" :text="t('cabinet.common.empty.table')">
            <CabButton icon="plus" @click="openDialog('submit')">{{ t('cabinet.author.dashboard.newArticle') }}</CabButton>
          </EmptyState>
        </template>
      </DataTable>

      <CabPagination
        v-model:page="articles.page"
        :page-count="articles.pageCount"
        :total="articles.total"
        :page-size="articles.pageSize"
      />
    </CabPanel>

    <CabPanel :title="t('cabinet.author.dashboard.notifications')" flush>
      <template #actions>
        <RouterLink :to="{ name: 'author-notifications' }" class="panel-link">
          {{ t('cabinet.author.dashboard.allNotifications') }}
          <AppIcon name="chevron-right" :size="16" />
        </RouterLink>
      </template>
      <NotificationList :items="latestNotifications" />
    </CabPanel>
  </div>

  <SubmitArticleWizard :open="dialog === 'submit'" @close="closeDialog" @submitted="onSubmitted" />
  <EditorCommentsModal :open="dialog === 'comments'" :article="selected" @close="closeDialog" @uploaded="onRevisionUploaded" />
  <PayArticleModal :open="dialog === 'pay'" :article="selected" @close="closeDialog" @paid="onPaid" />
  <ArticleDetailsModal :open="dialog === 'details'" :article="selected" @close="closeDialog" />
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: 32px;
}

.cell-muted {
  color: var(--cab-subtle);
}

.panel-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--color-primary);
  transition: color var(--transition);
}

.panel-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 767.98px) {
  .dashboard {
    gap: 24px;
  }
}
</style>
