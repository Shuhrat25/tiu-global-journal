<script setup>
/* Read-only article card: metadata, file, the editor's feedback and the status history */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/i18n/dates'
import { downloadTextFile } from '@/utils/format'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import StatusBadge from '@/components/cabinet/StatusBadge.vue'
import ArticleInfo from './ArticleInfo.vue'
import DateText from './DateText.vue'
import EditorNote from './EditorNote.vue'
import StatusTimeline from './StatusTimeline.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { t, locale } = useI18n()

const NOTE_TONES = { rejected: 'danger', revision: 'warning' }

const isRejected = computed(() => props.article?.status === 'rejected')
const rejectReason = computed(() =>
  isRejected.value && props.article.rejectReason ? t(`cabinet.common.rejectReasons.${props.article.rejectReason}`) : '',
)
const noteTone = computed(() => NOTE_TONES[props.article?.status] ?? 'info')

/* demo download (no file storage yet): a text file with the article data under the original name */
function download() {
  const { title, authors, keywords, abstract, submittedAt, fileName } = props.article
  const content = [
    `${t('cabinet.common.table.title')}: ${title}`,
    `${t('cabinet.common.table.authors')}: ${authors}`,
    `${t('cabinet.author.info.keywords')}: ${keywords}`,
    `${t('cabinet.common.table.submitted')}: ${formatDate(submittedAt, locale.value)}`,
    '',
    `${t('cabinet.author.info.abstract')}:`,
    abstract,
  ].join('\n')
  downloadTextFile(fileName, content)
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.author.details.title')" @close="emit('close')">
    <div v-if="article" class="details">
      <div class="details__main">
        <div class="details__head">
          <h3 class="details__title">{{ article.title }}</h3>
          <p class="details__meta">
            <StatusBadge :status="article.status" />
            <span>{{ t('cabinet.common.table.submitted') }}: <DateText :date="article.submittedAt" /></span>
          </p>
        </div>

        <ArticleInfo :article="article" />

        <div class="details__file">
          <span class="details__file-icon"><AppIcon name="file-text" :size="20" /></span>
          <span class="details__file-info">
            <span class="details__file-label">{{ t('cabinet.author.details.file') }}</span>
            <strong>{{ article.fileName }}</strong>
          </span>
          <CabButton variant="outline" size="sm" icon="download" @click="download">
            {{ t('cabinet.common.actions.download') }}
          </CabButton>
        </div>

        <EditorNote
          v-if="rejectReason || article.editorComment"
          :title="t('cabinet.author.details.feedback')"
          :tone="noteTone"
        >
          <p v-if="rejectReason">
            <strong>{{ t('cabinet.author.details.rejectReason') }}:</strong> {{ rejectReason }}
          </p>
          <p v-if="article.editorComment">{{ article.editorComment }}</p>
        </EditorNote>
      </div>

      <section class="details__history" aria-labelledby="details-history-title">
        <h3 id="details-history-title" class="details__subtitle">{{ t('cabinet.author.details.history') }}</h3>
        <StatusTimeline :history="article.history ?? []" />
      </section>
    </div>

    <template #footer>
      <CabButton variant="secondary" @click="emit('close')">{{ t('cabinet.common.actions.close') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 24px 32px;
}

.details__main {
  display: grid;
  gap: 20px;
  align-content: start;
  min-width: 0;
}

.details__head {
  display: grid;
  gap: 10px;
}

.details__title {
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

.details__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
}

.details__file {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.details__file-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--tone-blue-bg);
  color: var(--tone-blue-fg);
}

.details__file-info {
  display: grid;
  flex: 1 1 160px;
  min-width: 0;
}

.details__file-label {
  font-size: 12px;
  line-height: 16px;
  color: var(--cab-muted);
}

.details__file-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  line-height: 22px;
  font-weight: 500;
  color: var(--cab-text);
}

.details__history {
  padding-left: 24px;
  border-left: 1px solid var(--cab-border);
}

.details__subtitle {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--cab-text);
}

@media (max-width: 767.98px) {
  .details {
    grid-template-columns: minmax(0, 1fr);
  }

  .details__history {
    padding: 20px 0 0;
    border-top: 1px solid var(--cab-border);
    border-left: 0;
  }
}
</style>
