<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import VerdictChip from '@/components/cabinet/VerdictChip.vue'
import ArticleHeading from './ArticleHeading.vue'
import ModalSection from './ModalSection.vue'
import { awaitsDecision } from './awaitsDecision'

/* Figma "Retsenzent fikri": the fields the reviewer filled in (Figma comment #20) */
const SECTIONS = ['significance', 'novelty', 'methodology', 'recommendations']

const props = defineProps({
  open: { type: Boolean, default: false },
  review: { type: Object, default: null },
})

const emit = defineEmits(['close', 'decide'])

const store = useJournalStore()
const { t } = useI18n()

const article = computed(() => (props.review ? store.articleById(props.review.articleId) : null))
const canDecide = computed(() => awaitsDecision(store, props.review))
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.editor.result.title')" size="md" @close="emit('close')">
    <div v-if="review && article" class="result">
      <ArticleHeading :title="article.title">
        <p>{{ t('cabinet.editor.article.reviewer', { name: store.userName(review.reviewerId) }) }}</p>
      </ArticleHeading>

      <div class="result__sections">
        <ModalSection v-for="key in SECTIONS" :key="key" :title="t(`cabinet.common.review.${key}`)" :text="review[key]" />
        <ModalSection :title="t('cabinet.common.review.verdict')">
          <div><VerdictChip v-if="review.verdict" :verdict="review.verdict" /></div>
        </ModalSection>
      </div>
    </div>

    <template #footer>
      <CabButton variant="outline" @click="emit('close')">{{ t('cabinet.common.actions.close') }}</CabButton>
      <CabButton v-if="canDecide" icon="check-circle" @click="emit('decide')">{{ t('cabinet.editor.actions.decide') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.result {
  display: grid;
  gap: 24px;
}

.result__sections {
  display: grid;
  gap: 16px;
}
</style>
