<script setup>
import { computed, reactive, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FINAL_DECISIONS, useJournalStore } from '@/stores/journal'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabField from '@/components/cabinet/CabField.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import VerdictChip from '@/components/cabinet/VerdictChip.vue'
import ArticleHeading from './ArticleHeading.vue'

/*
 * Figma "Yakuniy muharrir qarori": the editor's final decision on a reviewed article.
 * The comment to the author is required unless the article is accepted.
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'done'])

const store = useJournalStore()
const { t } = useI18n()
const formId = `decision-form-${useId()}`

const form = ref(null)
const decision = ref('')
const comment = ref('')
const touched = reactive({ decision: false, comment: false })

// every opening starts with an empty form
watch(
  () => props.open,
  (open) => {
    if (!open) return
    decision.value = ''
    comment.value = ''
    touched.decision = false
    touched.comment = false
  },
)

const review = computed(() => (props.article ? store.reviewForArticle(props.article.id) : null))
const commentRequired = computed(() => Boolean(decision.value) && decision.value !== 'accept')
const isValid = computed(() => Boolean(decision.value) && (!commentRequired.value || Boolean(comment.value.trim())))

const decisionError = computed(() => (touched.decision && !decision.value ? t('cabinet.common.form.chooseOption') : ''))
const commentError = computed(() =>
  touched.comment && commentRequired.value && !comment.value.trim() ? t('cabinet.common.form.required') : '',
)
const commentHint = computed(() => {
  if (!decision.value) return ''
  return t(commentRequired.value ? 'cabinet.editor.decision.commentRequired' : 'cabinet.editor.decision.commentOptional')
})

/*
 * A field shows its error once the editor moves on to the other field of the form.
 * Leaving the form (Cancel, ×, the backdrop) is not a validation moment.
 */
function markTouched(field, event) {
  if (form.value?.contains(event.relatedTarget)) touched[field] = true
}

function submit() {
  // the dialog stays clickable while it fades out: a second click must not repeat the decision or its message
  if (!props.open || props.article?.status !== 'reviewed' || !isValid.value) return
  const chosen = decision.value
  store.makeFinalDecision(props.article.id, chosen, comment.value.trim())
  emit('done', {
    message: () => t('cabinet.editor.notices.decisionSent', { decision: t(`cabinet.common.decisions.${chosen}`) }),
    tone: chosen === 'accept' ? 'success' : 'info',
  })
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.editor.decision.title')" size="md" @close="emit('close')">
    <form v-if="article" :id="formId" ref="form" class="decision" novalidate @submit.prevent="submit">
      <ArticleHeading :title="article.title">
        <p v-if="review?.verdict" class="decision__verdict">
          <span>{{ t('cabinet.common.review.verdict') }}</span>
          <VerdictChip :verdict="review.verdict" />
        </p>
      </ArticleHeading>

      <CabField :id="`${formId}-decision`" :label="t('cabinet.editor.decision.label')" required :error="decisionError">
        <select
          :id="`${formId}-decision`"
          v-model="decision"
          class="cab-select"
          :class="{ 'has-error': decisionError }"
          required
          @blur="markTouched('decision', $event)"
        >
          <option value="" disabled>{{ t('cabinet.editor.decision.placeholder') }}</option>
          <option v-for="key in FINAL_DECISIONS" :key="key" :value="key">{{ t(`cabinet.common.decisions.${key}`) }}</option>
        </select>
      </CabField>

      <CabField
        :id="`${formId}-comment`"
        :label="t('cabinet.editor.decision.commentLabel')"
        :required="commentRequired"
        :error="commentError"
        :hint="commentHint"
      >
        <textarea
          :id="`${formId}-comment`"
          v-model="comment"
          class="cab-textarea"
          :class="{ 'has-error': commentError }"
          rows="6"
          :required="commentRequired"
          :placeholder="t('cabinet.editor.decision.commentPlaceholder')"
          @blur="markTouched('comment', $event)"
        />
      </CabField>
    </form>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.cancel') }}</CabButton>
      <CabButton type="submit" :form="formId" icon="send" :disabled="!isValid">{{ t('cabinet.editor.decision.submit') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.decision {
  display: grid;
  gap: 24px;
}

.decision__verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
