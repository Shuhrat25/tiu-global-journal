<script setup>
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'

/* Confirmation before a paid article is marked as published (Figma comment #12: sent to print) */
const props = defineProps({
  open: { type: Boolean, default: false },
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'done'])

const store = useJournalStore()
const { t } = useI18n()

function confirm() {
  // the dialog stays clickable while it fades out: a second click must not repeat the message
  if (!props.open || props.article?.status !== 'paid') return
  store.markPublished(props.article.id)
  emit('done', { message: () => t('cabinet.editor.notices.published'), tone: 'success' })
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.editor.publish.title')" size="sm" @close="emit('close')">
    <div v-if="article" class="confirm">
      <p class="confirm__question">{{ t('cabinet.editor.publish.question', { title: article.title }) }}</p>
      <p class="confirm__note">{{ t('cabinet.editor.publish.note') }}</p>
    </div>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.cancel') }}</CabButton>
      <CabButton variant="success" icon="book-check" @click="confirm">{{ t('cabinet.common.actions.confirm') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.confirm {
  display: grid;
  gap: 8px;
}

.confirm__question {
  font-size: 16px;
  line-height: 24px;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

.confirm__note {
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
}
</style>
