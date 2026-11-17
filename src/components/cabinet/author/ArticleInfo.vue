<script setup>
/* Read-only article metadata as label/value rows (wizard summary, details dialog). Empty values are skipped. */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const LABELS = {
  title: 'cabinet.common.table.title',
  authors: 'cabinet.common.table.authors',
  keywords: 'cabinet.author.info.keywords',
  abstract: 'cabinet.author.info.abstract',
  conflict: 'cabinet.author.info.conflict',
}

const props = defineProps({
  /** an article or the submission form: { title, authors, keywords, abstract, conflict } */
  article: { type: Object, required: true },
  fields: { type: Array, default: () => ['authors', 'keywords', 'abstract', 'conflict'] },
})

const { t } = useI18n()

const rows = computed(() =>
  props.fields
    .map((key) => ({ key, label: t(LABELS[key]), value: String(props.article[key] ?? '').trim() }))
    .filter((row) => row.value),
)

const splitKeywords = (value) =>
  value
    .split(/[,;]/)
    .map((word) => word.trim())
    .filter(Boolean)
</script>

<template>
  <dl class="info">
    <div v-for="row in rows" :key="row.key" class="info__row">
      <dt class="info__label">{{ row.label }}</dt>
      <dd v-if="row.key === 'keywords'" class="info__value info__tags">
        <span v-for="(word, index) in splitKeywords(row.value)" :key="`${index}-${word}`" class="info__tag">{{ word }}</span>
      </dd>
      <dd v-else class="info__value" :class="{ 'info__value--title': row.key === 'title' }">{{ row.value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.info {
  display: grid;
  gap: 16px;
  margin: 0;
}

.info__row {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.info__label {
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  color: var(--cab-muted);
}

.info__value {
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  color: var(--cab-text);
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.info__value--title {
  font-weight: 500;
}

.info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  white-space: normal;
}

.info__tag {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--tone-gray-bg);
  font-size: 13px;
  line-height: 20px;
  color: var(--cab-text-2);
}
</style>
