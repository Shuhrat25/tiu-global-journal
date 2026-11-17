<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabField from '@/components/cabinet/CabField.vue'

/* What the author has to fix before the article goes further. Submitted by a footer button with form="<id>". */
defineProps({
  id: { type: String, required: true },
})

const emit = defineEmits(['submit'])
const { t } = useI18n()

const form = ref(null)
const comment = ref('')
const showErrors = ref(false)

const error = computed(() => (showErrors.value && !comment.value.trim() ? t('cabinet.common.form.required') : ''))

function submit() {
  showErrors.value = true
  if (!comment.value.trim()) {
    focusFirstInvalid(form.value)
    return
  }
  emit('submit', { comment: comment.value.trim() })
}
</script>

<template>
  <form :id="id" ref="form" novalidate @submit.prevent="submit">
    <CabField
      :id="`${id}-comment`"
      :label="t('cabinet.editor.revision.commentLabel')"
      required
      :error="error"
      :hint="t('cabinet.editor.revision.commentHint')"
    >
      <textarea
        :id="`${id}-comment`"
        v-model="comment"
        class="cab-textarea"
        :class="{ 'has-error': error }"
        rows="6"
        required
        :placeholder="t('cabinet.editor.revision.commentPlaceholder')"
      />
    </CabField>
  </form>
</template>
