<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabField from '@/components/cabinet/CabField.vue'

/* Choice of the reviewer an accepted submission is sent to. Submitted by a footer button with form="<id>". */
defineProps({
  id: { type: String, required: true },
})

const emit = defineEmits(['submit'])
const store = useJournalStore()
const { t } = useI18n()

const form = ref(null)
const reviewerId = ref('')
const showErrors = ref(false)

const error = computed(() => (showErrors.value && !reviewerId.value ? t('cabinet.common.form.chooseOption') : ''))

function submit() {
  showErrors.value = true
  if (!reviewerId.value) {
    focusFirstInvalid(form.value)
    return
  }
  emit('submit', { reviewerId: reviewerId.value })
}
</script>

<template>
  <form :id="id" ref="form" novalidate @submit.prevent="submit">
    <CabField
      :id="`${id}-reviewer`"
      :label="t('cabinet.editor.review.reviewerLabel')"
      required
      :error="error"
      :hint="t('cabinet.editor.review.reviewerHint')"
    >
      <select
        :id="`${id}-reviewer`"
        v-model="reviewerId"
        class="cab-select"
        :class="{ 'has-error': error }"
        required
      >
        <option value="" disabled>{{ t('cabinet.editor.review.reviewerPlaceholder') }}</option>
        <option v-for="reviewer in store.reviewers" :key="reviewer.id" :value="reviewer.id">{{ reviewer.name }}</option>
      </select>
    </CabField>
  </form>
</template>
