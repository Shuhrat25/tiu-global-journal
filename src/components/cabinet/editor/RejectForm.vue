<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { REJECT_REASONS } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabField from '@/components/cabinet/CabField.vue'

/*
 * Why a submission is rejected at the initial check: one of the standard reasons,
 * plus a comment that is required for "other". Submitted by a footer button with form="<id>".
 */
defineProps({
  id: { type: String, required: true },
})

const emit = defineEmits(['submit'])
const { t } = useI18n()

const form = ref(null)
const reason = ref('')
const comment = ref('')
const showErrors = ref(false)

const commentRequired = computed(() => reason.value === 'other')
const commentMissing = computed(() => commentRequired.value && !comment.value.trim())
const reasonError = computed(() => (showErrors.value && !reason.value ? t('cabinet.common.form.chooseOption') : ''))
const commentError = computed(() => (showErrors.value && commentMissing.value ? t('cabinet.common.form.required') : ''))

function submit() {
  showErrors.value = true
  if (!reason.value || commentMissing.value) {
    focusFirstInvalid(form.value)
    return
  }
  emit('submit', { reason: reason.value, comment: comment.value.trim() })
}
</script>

<template>
  <form :id="id" ref="form" class="reject" novalidate @submit.prevent="submit">
    <fieldset class="reject__reasons">
      <legend class="reject__legend">
        {{ t('cabinet.editor.reject.reasonLabel') }}
        <span class="reject__required" aria-hidden="true">*</span>
      </legend>
      <div class="reject__options">
        <label v-for="key in REJECT_REASONS" :key="key" class="cab-choice">
          <input
            v-model="reason"
            type="radio"
            :name="`${id}-reason`"
            :value="key"
            required
            :aria-invalid="Boolean(reasonError)"
            :aria-describedby="reasonError ? `${id}-reason-error` : undefined"
          />
          <span>{{ t(`cabinet.common.rejectReasons.${key}`) }}</span>
        </label>
      </div>
      <p v-if="reasonError" :id="`${id}-reason-error`" class="reject__error">{{ reasonError }}</p>
    </fieldset>

    <CabField
      :id="`${id}-comment`"
      :label="t('cabinet.editor.reject.commentLabel')"
      :required="commentRequired"
      :error="commentError"
      :hint="t('cabinet.editor.reject.commentHint', { other: t('cabinet.common.rejectReasons.other') })"
    >
      <textarea
        :id="`${id}-comment`"
        v-model="comment"
        class="cab-textarea"
        :class="{ 'has-error': commentError }"
        :required="commentRequired"
        :placeholder="t('cabinet.editor.reject.commentPlaceholder')"
      />
    </CabField>
  </form>
</template>

<style scoped>
.reject {
  display: grid;
  gap: 20px;
}

.reject__reasons {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.reject__legend {
  margin-bottom: 8px;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text-2);
}

.reject__required {
  color: var(--cab-danger);
}

.reject__options {
  display: grid;
  gap: 8px;
}

.reject__error {
  margin-top: 8px;
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-danger);
}

@media (min-width: 768px) {
  .reject__options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
