<script setup>
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import { downloadTextFile } from '@/utils/format'

/* The submitted manuscript with a download button (demo: a text file with the article details) */
const props = defineProps({
  article: { type: Object, required: true },
})

const { t } = useI18n()
const nameId = `article-file-${useId()}`

function download() {
  const { title, authors, abstract, keywords, fileName } = props.article
  const content = [
    title,
    t('cabinet.editor.article.authors', { authors }),
    '',
    abstract,
    '',
    t('cabinet.editor.article.keywordsLine', { keywords }),
  ].join('\n')
  downloadTextFile(fileName, content)
}
</script>

<template>
  <div v-if="article.fileName" class="article-file">
    <span class="article-file__icon"><AppIcon name="file-text" :size="20" /></span>
    <span :id="nameId" class="article-file__name">{{ article.fileName }}</span>
    <CabButton variant="outline" size="sm" icon="download" :aria-describedby="nameId" @click="download">
      {{ t('cabinet.common.actions.download') }}
    </CabButton>
  </div>
</template>

<style scoped>
.article-file {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.article-file__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--tone-blue-bg);
  color: var(--tone-blue-fg);
}

.article-file__name {
  flex: 1 1 160px;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text);
}
</style>
