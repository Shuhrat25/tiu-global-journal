<script setup>
/*
 * "Download the article" button. There is no file storage yet, so the demo saves
 * a text file with the article details under the article's file name.
 * Other attributes (variant, size, aria-*) are passed on to CabButton.
 */
import { useI18n } from 'vue-i18n'
import CabButton from '@/components/cabinet/CabButton.vue'
import { formatDate } from '@/i18n/dates'
import { downloadTextFile } from '@/utils/format'

const props = defineProps({
  article: { type: Object, required: true },
})

const { t, locale } = useI18n()

function download() {
  const { title, authors, keywords, abstract, submittedAt, fileName } = props.article
  const lines = [
    title,
    t('cabinet.reviewer.article.authors', { authors }),
    t('cabinet.reviewer.article.submitted', { date: formatDate(submittedAt, locale.value) }),
    t('cabinet.reviewer.file.keywords', { keywords: keywords ?? '' }),
    '',
    t('cabinet.reviewer.file.abstract'),
    abstract ?? '',
    '',
    t('cabinet.reviewer.file.demo', { file: fileName }),
  ]
  downloadTextFile(fileName, lines.join('\n'))
}
</script>

<template>
  <CabButton icon="download" @click="download"><slot /></CabButton>
</template>
