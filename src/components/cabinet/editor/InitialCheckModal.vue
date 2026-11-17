<script setup>
import { computed, nextTick, reactive, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import ArticleHeading from './ArticleHeading.vue'
import ArticleFile from './ArticleFile.vue'
import ModalSection from './ModalSection.vue'
import RejectForm from './RejectForm.vue'
import RevisionForm from './RevisionForm.vue'
import ReviewerForm from './ReviewerForm.vue'

/*
 * Figma "Dastlabki tekshiruv": the editor checks a new submission, then rejects it,
 * asks the author for changes or sends it to a reviewer. Each outcome replaces the
 * checklist with its own small form inside the same dialog (`mode`).
 */
const CHECKS = ['format', 'plagiarism', 'scope']
const TITLES = {
  check: 'cabinet.editor.check.title',
  reject: 'cabinet.editor.reject.title',
  revision: 'cabinet.editor.revision.title',
  review: 'cabinet.editor.review.title',
}

const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'done'])

const store = useJournalStore()
const { t } = useI18n()
const formId = `check-form-${useId()}`

const mode = ref('check') // check | reject | revision | review
const checks = reactive(Object.fromEntries(CHECKS.map((key) => [key, false])))
const body = ref(null)

const allChecked = computed(() => CHECKS.every((key) => checks[key]))

/* earlier invitations for this article that a reviewer turned down */
const declinedReviews = computed(() =>
  props.article ? store.reviews.filter((review) => review.articleId === props.article.id && review.status === 'declined') : [],
)

// every opening starts with an empty checklist (the sub-forms are re-created with the dialog content)
watch(
  () => props.open,
  (open) => {
    if (!open) return
    mode.value = 'check'
    for (const key of CHECKS) checks[key] = false
  },
)

// the button that switched the mode is gone, so move the focus into the new form
watch(mode, async () => {
  await nextTick()
  body.value?.querySelector('input, select, textarea')?.focus()
})

/* one outcome per opening: the first one takes the article out of `submitted`, a repeated submit is ignored */
const isPending = () => props.open && props.article?.status === 'submitted'

function reject({ reason, comment }) {
  if (!isPending()) return
  store.rejectArticle(props.article.id, reason, comment)
  emit('done', { message: () => t('cabinet.editor.notices.rejected'), tone: 'info' })
}

function requestRevision({ comment }) {
  if (!isPending()) return
  store.requestRevision(props.article.id, comment)
  emit('done', { message: () => t('cabinet.editor.notices.revisionRequested'), tone: 'info' })
}

function sendToReview({ reviewerId }) {
  if (!isPending()) return
  store.sendToReview(props.article.id, reviewerId)
  emit('done', { message: () => t('cabinet.editor.notices.sentToReview'), tone: 'success' })
}
</script>

<template>
  <CabModal :open="open" :title="t(TITLES[mode])" size="md" @close="emit('close')">
    <div v-if="article" ref="body" class="check">
      <ArticleHeading :title="article.title">
        <p>{{ t('cabinet.editor.article.authors', { authors: article.authors }) }}</p>
      </ArticleHeading>

      <template v-if="mode === 'check'">
        <ArticleFile :article="article" />
        <ModalSection :title="t('cabinet.editor.article.abstract')" :text="article.abstract" />

        <div v-for="review in declinedReviews" :key="review.id" class="check__declined">
          <AppIcon name="alert-circle" :size="18" />
          <div>
            <p>
              {{
                t('cabinet.editor.check.declined', {
                  name: store.userName(review.reviewerId),
                  reason: t(`cabinet.common.declineReasons.${review.declineReason}`),
                })
              }}
            </p>
            <p v-if="review.declineComment" class="check__declined-comment">{{ review.declineComment }}</p>
          </div>
        </div>

        <ModalSection :title="t('cabinet.editor.check.listTitle')">
          <div class="check__list">
            <label v-for="key in CHECKS" :key="key" class="cab-check">
              <input v-model="checks[key]" type="checkbox" />
              <span>{{ t(`cabinet.editor.check.items.${key}`) }}</span>
            </label>
          </div>
          <p v-if="!allChecked" class="check__hint">{{ t('cabinet.editor.check.hint') }}</p>
        </ModalSection>
      </template>

      <!-- while the dialog stays open, a sub-form keeps what was typed when the editor goes back to the checklist and returns -->
      <KeepAlive>
        <RejectForm v-if="mode === 'reject'" :id="formId" @submit="reject" />
        <RevisionForm v-else-if="mode === 'revision'" :id="formId" @submit="requestRevision" />
        <ReviewerForm v-else-if="mode === 'review'" :id="formId" @submit="sendToReview" />
      </KeepAlive>
    </div>

    <template #footer>
      <template v-if="mode === 'check'">
        <CabButton variant="danger-outline" @click="mode = 'reject'">{{ t('cabinet.editor.check.reject') }}</CabButton>
        <CabButton variant="outline" @click="mode = 'revision'">{{ t('cabinet.editor.check.requestRevision') }}</CabButton>
        <CabButton :disabled="!allChecked" @click="mode = 'review'">
          <span class="check__label">{{ t('cabinet.editor.check.accept') }}</span>
        </CabButton>
      </template>
      <template v-else>
        <CabButton variant="outline" icon="arrow-left" class="check__back" @click="mode = 'check'">
          {{ t('cabinet.common.actions.back') }}
        </CabButton>
        <CabButton v-if="mode === 'reject'" type="submit" :form="formId" variant="danger" icon="x-circle">
          {{ t('cabinet.editor.reject.submit') }}
        </CabButton>
        <CabButton v-else-if="mode === 'revision'" type="submit" :form="formId" icon="send">
          {{ t('cabinet.editor.revision.submit') }}
        </CabButton>
        <CabButton v-else type="submit" :form="formId" icon="send">{{ t('cabinet.editor.review.submit') }}</CabButton>
      </template>
    </template>
  </CabModal>
</template>

<style scoped>
.check {
  display: grid;
  gap: 24px;
}

.check__declined {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--cab-radius-sm);
  background: var(--tone-yellow-bg);
  font-size: 14px;
  line-height: 20px;
  color: var(--tone-yellow-fg);
}

.check__declined-comment {
  margin-top: 4px;
  font-style: italic;
  overflow-wrap: anywhere;
}

.check__list {
  display: grid;
  gap: 16px;
  margin-top: 8px;
}

.check__hint {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}

.check__back {
  margin-right: auto;
}

/* the longest footer label may wrap on narrow phones instead of overflowing the dialog */
@media (max-width: 767.98px) {
  .check__label {
    white-space: normal;
  }
}
</style>
