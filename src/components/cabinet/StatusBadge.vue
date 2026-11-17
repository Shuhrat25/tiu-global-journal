<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/* Article / review status → colour. Labels come from cabinet.common.status / reviewStatus */
const ARTICLE_TONES = {
  submitted: 'blue',
  revision: 'orange',
  in_review: 'yellow',
  reviewed: 'purple',
  accepted: 'teal',
  paid: 'indigo',
  published: 'green',
  rejected: 'red',
}

const REVIEW_TONES = {
  invited: 'blue',
  accepted: 'yellow',
  submitted: 'green',
  declined: 'red',
}

const props = defineProps({
  status: { type: String, required: true },
  /** article | review */
  kind: { type: String, default: 'article' },
})

const { t } = useI18n()

const tone = computed(() => (props.kind === 'review' ? REVIEW_TONES : ARTICLE_TONES)[props.status] ?? 'gray')
const label = computed(() =>
  t(props.kind === 'review' ? `cabinet.common.reviewStatus.${props.status}` : `cabinet.common.status.${props.status}`),
)
</script>

<template>
  <span class="badge" :class="`badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
  white-space: nowrap;
}

.badge--blue { background: var(--tone-blue-bg); color: var(--tone-blue-fg); }
.badge--yellow { background: var(--tone-yellow-bg); color: var(--tone-yellow-fg); }
.badge--green { background: var(--tone-green-bg); color: var(--tone-green-fg); }
.badge--orange { background: var(--tone-orange-bg); color: var(--tone-orange-fg); }
.badge--red { background: var(--tone-red-bg); color: var(--tone-red-fg); }
.badge--purple { background: var(--tone-purple-bg); color: var(--tone-purple-fg); }
.badge--teal { background: var(--tone-teal-bg); color: var(--tone-teal-fg); }
.badge--indigo { background: var(--tone-indigo-bg); color: var(--tone-indigo-fg); }
.badge--gray { background: var(--tone-gray-bg); color: var(--tone-gray-fg); }
</style>
