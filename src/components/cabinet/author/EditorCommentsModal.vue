<script setup>
/* Figma "Muharrir izohlari": the editor's revision request and the upload of the corrected file */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabField from '@/components/cabinet/CabField.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import FileDrop from '@/components/cabinet/FileDrop.vue'
import ArticleHeading from './ArticleHeading.vue'
import EditorNote from './EditorNote.vue'

const FILE_ID = 'revision-file'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** article in the `revision` status */
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'uploaded'])

const store = useJournalStore()
const { t } = useI18n()

const file = ref(null)
const fileError = ref('') // wrong type / too big, reported by FileDrop
const attempted = ref(false)
const content = ref(null)

const error = computed(
  () => fileError.value || (attempted.value && !file.value ? t('cabinet.author.comments.fileRequired') : ''),
)

// every opening starts with an empty file field
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    file.value = null
    fileError.value = ''
    attempted.value = false
  },
)

function upload() {
  if (!props.open) return // the dialog is fading out: a second click must not report the upload again
  attempted.value = true
  if (!file.value) {
    focusFirstInvalid(content.value)
    return
  }
  store.uploadRevision(props.article.id, file.value.name)
  emit('uploaded', props.article)
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.author.comments.title')" size="sm" @close="emit('close')">
    <div v-if="article" ref="content" class="comments">
      <ArticleHeading :article="article" />

      <EditorNote :title="t('cabinet.author.comments.comment')">
        {{ article.editorComment || t('cabinet.author.comments.noComment') }}
      </EditorNote>

      <div class="comments__upload">
        <CabField :id="FILE_ID" :label="t('cabinet.author.comments.fileLabel')" required :error="error">
          <FileDrop :id="FILE_ID" v-model="file" :invalid="Boolean(error)" @error="fileError = $event" />
        </CabField>
        <p class="cab-meta comments__current">
          <span>
            {{ t('cabinet.common.file.current') }}: <strong>{{ article.fileName }}</strong>
          </span>
        </p>
      </div>
    </div>

    <template #footer>
      <CabButton variant="secondary" @click="emit('close')">{{ t('cabinet.common.actions.close') }}</CabButton>
      <CabButton icon="upload" @click="upload">{{ t('cabinet.author.comments.submit') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.comments {
  display: grid;
  gap: 20px;
}

.comments__upload {
  display: grid;
  gap: 10px;
}

.comments__current {
  overflow-wrap: anywhere;
}
</style>
