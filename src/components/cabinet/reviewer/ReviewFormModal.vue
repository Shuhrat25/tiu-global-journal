<script setup>
/*
 * Review form (Figma "Maqola taqrizi shakli"). Starts from the saved draft if there is one.
 * "Save draft" skips validation; "Submit" requires every field.
 * Closing the dialog (×, Esc, backdrop) with unsaved changes keeps them as a draft,
 * so a long review is never lost by an accidental click. Saving an emptied form removes the draft.
 */
import { reactive, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FINAL_DECISIONS } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabField from '@/components/cabinet/CabField.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import CabNotice from '@/components/cabinet/CabNotice.vue'
import ArticleSummary from './ArticleSummary.vue'
import { REVIEW_TEXT_FIELDS, hasDraftContent } from './review-fields'

const props = defineProps({
  open: { type: Boolean, default: false },
  review: { type: Object, default: null },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save-draft', 'submit'])

const EMPTY_FORM = { significance: '', novelty: '', methodology: '', recommendations: '', verdict: '' }
const FIELD_ORDER = [...REVIEW_TEXT_FIELDS, 'verdict']

const { t } = useI18n()
const uid = useId()
const formId = `${uid}-review`
const fieldId = (field) => `${uid}-${field}`

const form = reactive({ ...EMPTY_FORM })
const errors = reactive({}) // field → message key in cabinet.common.form
const restoredDraft = ref(false)
const formEl = ref(null)
let savedState = ''

const snapshot = () => JSON.stringify(form)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    const draft = props.review?.draft
    Object.assign(form, EMPTY_FORM, draft ?? {})
    FIELD_ORDER.forEach(clearError)
    restoredDraft.value = hasDraftContent(draft)
    savedState = snapshot()
  },
)

function clearError(field) {
  delete errors[field]
}

function validate() {
  FIELD_ORDER.forEach(clearError)
  for (const field of REVIEW_TEXT_FIELDS) if (!form[field].trim()) errors[field] = 'required'
  if (!form.verdict) errors.verdict = 'chooseOption'
  return !FIELD_ORDER.some((field) => errors[field])
}

/*
 * The dialog stays on screen (and clickable) while it fades out, so a double click or a late Esc
 * could submit or save again: once it is closing, its buttons do nothing.
 */
function submit() {
  if (!props.open) return
  if (!validate()) {
    focusFirstInvalid(formEl.value)
    return
  }
  emit('submit', Object.fromEntries(FIELD_ORDER.map((field) => [field, form[field].trim()])))
}

function saveDraft() {
  if (!props.open) return
  // an empty form is saved only to clear an earlier draft; otherwise there is nothing to keep
  if (hasDraftContent(form) || hasDraftContent(props.review?.draft)) emit('save-draft', { ...form })
  else emit('close')
}

// unsaved changes go through saveDraft(), which also ignores a dialog that is already closing
function dismiss() {
  if (snapshot() !== savedState) saveDraft()
  else emit('close')
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.reviewer.form.title')" size="lg" @close="dismiss">
    <form v-if="article" :id="formId" ref="formEl" novalidate @submit.prevent="submit">
      <ArticleSummary :article="article" class="review-form__summary" />

      <CabNotice v-if="restoredDraft" tone="info" :text="t('cabinet.reviewer.form.draftRestored')" :dismissible="false" />

      <div class="review-form__grid">
        <CabField
          v-for="field in REVIEW_TEXT_FIELDS"
          :key="field"
          :id="fieldId(field)"
          :label="t(`cabinet.common.review.${field}`)"
          required
          :error="errors[field] ? t(`cabinet.common.form.${errors[field]}`) : ''"
        >
          <textarea
            :id="fieldId(field)"
            v-model="form[field]"
            class="cab-textarea"
            :class="{ 'has-error': errors[field] }"
            rows="5"
            :placeholder="t(`cabinet.reviewer.form.placeholders.${field}`)"
            aria-required="true"
            @input="clearError(field)"
          />
        </CabField>

        <CabField
          :id="fieldId('verdict')"
          :label="t('cabinet.reviewer.form.verdict')"
          required
          :error="errors.verdict ? t(`cabinet.common.form.${errors.verdict}`) : ''"
        >
          <select
            :id="fieldId('verdict')"
            v-model="form.verdict"
            class="cab-select"
            :class="{ 'has-error': errors.verdict }"
            aria-required="true"
            @change="clearError('verdict')"
          >
            <option value="" disabled>{{ t('cabinet.reviewer.form.verdictPlaceholder') }}</option>
            <option v-for="decision in FINAL_DECISIONS" :key="decision" :value="decision">
              {{ t(`cabinet.common.decisions.${decision}`) }}
            </option>
          </select>
        </CabField>
      </div>
    </form>

    <template #footer>
      <CabButton variant="outline" @click="saveDraft">{{ t('cabinet.reviewer.form.saveDraft') }}</CabButton>
      <CabButton type="submit" icon="send" :form="formId">{{ t('cabinet.reviewer.form.submit') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.review-form__summary {
  margin-bottom: 24px;
}

.review-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

@media (max-width: 767.98px) {
  .review-form__summary {
    margin-bottom: 16px;
  }

  .review-form__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}
</style>
