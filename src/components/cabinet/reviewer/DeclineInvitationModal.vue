<script setup>
/*
 * Declining a review invitation (Figma comment #24: "Rad etish" opens a form where
 * the reason is chosen). A comment is required only for "other".
 */
import { computed, reactive, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DECLINE_REASONS } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabField from '@/components/cabinet/CabField.vue'
import CabButton from '@/components/cabinet/CabButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const { t } = useI18n()
const uid = useId()
const formId = `${uid}-decline`
const reasonName = `${uid}-reason`
const reasonErrorId = `${uid}-reason-error`
const commentId = `${uid}-comment`

const formEl = ref(null)
const reason = ref('')
const comment = ref('')
const errors = reactive({ reason: false, comment: false })
const commentRequired = computed(() => reason.value === 'other')

// every opening starts with an empty form
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    reason.value = ''
    comment.value = ''
    errors.reason = false
    errors.comment = false
  },
)

watch(reason, () => {
  errors.reason = false
  if (!commentRequired.value) errors.comment = false
})
watch(comment, () => {
  errors.comment = false
})

function submit() {
  if (!props.open) return // the dialog is fading out: a second click must not decline again
  errors.reason = !reason.value
  errors.comment = commentRequired.value && !comment.value.trim()
  if (errors.reason || errors.comment) {
    focusFirstInvalid(formEl.value)
    return
  }
  emit('submit', { reason: reason.value, comment: comment.value.trim() })
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.reviewer.decline.title')" size="sm" @close="emit('close')">
    <form v-if="article" :id="formId" ref="formEl" class="decline" novalidate @submit.prevent="submit">
      <p class="cab-meta">
        <span>{{ t('cabinet.reviewer.decline.article') }}</span>
        <strong>{{ article.title }}</strong>
      </p>

      <fieldset class="decline__reasons">
        <legend class="decline__legend">
          {{ t('cabinet.reviewer.decline.reason') }}
          <span class="decline__required" aria-hidden="true">*</span>
        </legend>
        <label v-for="key in DECLINE_REASONS" :key="key" class="cab-choice">
          <input
            v-model="reason"
            type="radio"
            :name="reasonName"
            :value="key"
            required
            :aria-invalid="errors.reason"
            :aria-describedby="errors.reason ? reasonErrorId : undefined"
          />
          <span>{{ t(`cabinet.common.declineReasons.${key}`) }}</span>
        </label>
        <p v-if="errors.reason" :id="reasonErrorId" class="decline__error">
          {{ t('cabinet.common.form.chooseOption') }}
        </p>
      </fieldset>

      <CabField
        :id="commentId"
        :label="t('cabinet.reviewer.decline.comment')"
        :required="commentRequired"
        :error="errors.comment ? t('cabinet.common.form.required') : ''"
        :hint="t('cabinet.reviewer.decline.commentHint', { reason: t('cabinet.common.declineReasons.other') })"
      >
        <textarea
          :id="commentId"
          v-model="comment"
          class="cab-textarea"
          :class="{ 'has-error': errors.comment }"
          rows="3"
          :placeholder="t('cabinet.reviewer.decline.commentPlaceholder')"
          :aria-required="commentRequired"
        />
      </CabField>
    </form>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.cancel') }}</CabButton>
      <CabButton variant="danger" type="submit" icon="close" :form="formId">
        {{ t('cabinet.reviewer.decline.submit') }}
      </CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.decline {
  display: grid;
  gap: 20px;
}

.decline__reasons {
  display: grid;
  gap: 8px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.decline__legend {
  margin-bottom: 8px;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text-2);
}

.decline__required {
  color: var(--cab-danger);
}

.decline__error {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-danger);
}
</style>
